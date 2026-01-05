"""
Command-line interface for the Todo CLI application.

Contains display functions and operation handlers for user interaction.
"""

import sys

from src.models import Task
from src.storage import TaskStore
from src.validators import validate_title, validate_description, validate_task_id


def display_message(message: str, is_error: bool = False) -> None:
    """
    Display a message to the user.

    Args:
        message: The message to display.
        is_error: If True, output to stderr; otherwise stdout.
    """
    if is_error:
        print(message, file=sys.stderr)
    else:
        print(message)


def get_input(prompt: str) -> str:
    """
    Get input from the user with KeyboardInterrupt handling.

    Args:
        prompt: The prompt to display to the user.

    Returns:
        The user's input string, or empty string if interrupted.
    """
    try:
        return input(prompt)
    except KeyboardInterrupt:
        print()  # Newline after ^C
        return ""
    except EOFError:
        return ""


def display_menu() -> None:
    """Display the main menu options."""
    print("\n=== Todo Application ===\n")
    print("1. Add Task")
    print("2. List Tasks")
    print("3. Update Task")
    print("4. Delete Task")
    print("5. Toggle Complete")
    print("6. Exit")
    print()


def handle_add(store: TaskStore) -> None:
    """
    Handle the Add Task operation.

    Prompts user for title and description, validates input,
    and adds the task to the store.

    Args:
        store: The TaskStore instance to add the task to.
    """
    # Get and validate title
    while True:
        title = get_input("Enter task title: ")
        if not title:  # User pressed Ctrl+C or empty
            display_message("Operation cancelled.", is_error=True)
            return

        is_valid, error_msg = validate_title(title)
        if is_valid:
            break
        display_message(error_msg, is_error=True)

    # Get and validate description
    description = get_input("Enter description (optional): ")
    if description:
        is_valid, error_msg = validate_description(description)
        if not is_valid:
            display_message(error_msg, is_error=True)
            return

    # Add the task
    task_id = store.add(title.strip(), description)
    display_message(f"\nTask added successfully (ID: {task_id})")


def display_tasks(tasks: list[Task]) -> None:
    """
    Display a formatted list of tasks.

    Args:
        tasks: List of Task objects to display.
    """
    print("\n=== Your Tasks ===\n")

    complete_count = 0
    pending_count = 0

    for task in tasks:
        # Status indicator
        if task.completed:
            status = "\u2713"  # ✓
            complete_count += 1
        else:
            status = "\u2717"  # ✗
            pending_count += 1

        # Description preview (first 50 chars)
        desc_preview = task.description[:50]
        if len(task.description) > 50:
            desc_preview += "..."

        print(f"[{task.id}] {status} {task.title}")
        if desc_preview:
            print(f"    {desc_preview}")
        print()

    total = complete_count + pending_count
    print(f"Total: {total} tasks ({complete_count} complete, {pending_count} pending)")


def handle_list(store: TaskStore) -> None:
    """
    Handle the List Tasks operation.

    Retrieves all tasks from the store and displays them.

    Args:
        store: The TaskStore instance to get tasks from.
    """
    tasks = store.get_all()

    if not tasks:
        display_message("\nNo tasks yet. Add one!")
        return

    display_tasks(tasks)


def handle_toggle(store: TaskStore) -> None:
    """
    Handle the Toggle Complete operation.

    Prompts user for task ID and toggles its completion status.

    Args:
        store: The TaskStore instance containing the task.
    """
    # Check if there are any tasks
    if not store.get_all():
        display_message("\nNo tasks yet. Add one first!", is_error=True)
        return

    # Get and validate task ID
    id_input = get_input("Enter task ID to toggle: ")
    if not id_input:
        display_message("Operation cancelled.", is_error=True)
        return

    task_id, error_msg = validate_task_id(id_input)
    if task_id is None:
        display_message(error_msg, is_error=True)
        return

    # Toggle the task
    new_status = store.toggle(task_id)
    if new_status is None:
        display_message("Task not found. Please enter a valid ID.", is_error=True)
        return

    status_text = "complete" if new_status else "incomplete"
    display_message(f"\nTask {task_id} marked as {status_text}")


def handle_update(store: TaskStore) -> None:
    """
    Handle the Update Task operation.

    Prompts user for task ID and allows updating title and/or description.

    Args:
        store: The TaskStore instance containing the task.
    """
    # Check if there are any tasks
    if not store.get_all():
        display_message("\nNo tasks yet. Add one first!", is_error=True)
        return

    # Get and validate task ID
    id_input = get_input("Enter task ID to update: ")
    if not id_input:
        display_message("Operation cancelled.", is_error=True)
        return

    task_id, error_msg = validate_task_id(id_input)
    if task_id is None:
        display_message(error_msg, is_error=True)
        return

    # Check if task exists
    task = store.get(task_id)
    if task is None:
        display_message("Task not found. Please enter a valid ID.", is_error=True)
        return

    # Ask what to update
    print("\nWhat to update?")
    print("1. Title")
    print("2. Description")
    print("3. Both")
    update_choice = get_input("\nEnter choice: ").strip()

    new_title: str | None = None
    new_description: str | None = None

    if update_choice in ("1", "3"):
        # Get and validate new title
        while True:
            title_input = get_input(f"Enter new title (current: {task.title}): ")
            if not title_input:
                display_message("Operation cancelled.", is_error=True)
                return
            is_valid, error_msg = validate_title(title_input)
            if is_valid:
                new_title = title_input
                break
            display_message(error_msg, is_error=True)

    if update_choice in ("2", "3"):
        # Get and validate new description
        desc_input = get_input(f"Enter new description (current: {task.description[:30]}...): ")
        if desc_input or update_choice == "2":
            is_valid, error_msg = validate_description(desc_input)
            if not is_valid:
                display_message(error_msg, is_error=True)
                return
            new_description = desc_input

    if update_choice not in ("1", "2", "3"):
        display_message("Invalid choice. Please enter 1, 2, or 3.", is_error=True)
        return

    # Perform update
    store.update(task_id, title=new_title, description=new_description)
    display_message(f"\nTask {task_id} updated successfully")


def handle_delete(store: TaskStore) -> None:
    """
    Handle the Delete Task operation.

    Prompts user for task ID and deletes the task.

    Args:
        store: The TaskStore instance containing the task.
    """
    # Check if there are any tasks
    if not store.get_all():
        display_message("\nNo tasks yet. Add one first!", is_error=True)
        return

    # Get and validate task ID
    id_input = get_input("Enter task ID to delete: ")
    if not id_input:
        display_message("Operation cancelled.", is_error=True)
        return

    task_id, error_msg = validate_task_id(id_input)
    if task_id is None:
        display_message(error_msg, is_error=True)
        return

    # Delete the task
    if store.delete(task_id):
        display_message(f"\nTask {task_id} deleted successfully")
    else:
        display_message("Task not found. Please enter a valid ID.", is_error=True)
