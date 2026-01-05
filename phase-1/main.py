"""
Main entry point for the Todo CLI application.

Contains the main function with the menu loop and command dispatch.
"""

from src.cli import (
    display_menu,
    display_message,
    get_input,
    handle_add,
    handle_delete,
    handle_list,
    handle_toggle,
    handle_update,
)
from src.storage import TaskStore


def main() -> None:
    """
    Application entry point with main menu loop.

    Creates a TaskStore instance and runs the menu loop until
    the user chooses to exit.
    """
    store = TaskStore()

    print("Welcome to Todo CLI Application!")
    print("Your tasks will be stored in memory during this session.")

    while True:
        try:
            display_menu()
            choice = get_input("Enter choice (1-6): ").strip()

            if choice == "1":
                handle_add(store)
            elif choice == "2":
                handle_list(store)
            elif choice == "3":
                handle_update(store)
            elif choice == "4":
                handle_delete(store)
            elif choice == "5":
                handle_toggle(store)
            elif choice == "6":
                display_message("\nGoodbye! Your tasks were not saved (in-memory only).")
                break
            elif not choice:
                # Empty input (possibly from Ctrl+C), continue loop
                continue
            else:
                display_message("Invalid option. Please choose 1-6.", is_error=True)

        except KeyboardInterrupt:
            print()  # Newline after ^C
            display_message("\nGoodbye! Your tasks were not saved (in-memory only).")
            break


if __name__ == "__main__":
    main()
