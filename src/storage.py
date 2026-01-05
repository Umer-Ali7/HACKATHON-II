"""
In-memory storage for the Todo CLI application.

Contains the TaskStore class that manages task persistence and ID generation.
"""

from src.models import Task


class TaskStore:
    """
    In-memory storage for tasks.

    Manages task persistence using a dictionary and handles ID generation.
    Tasks are keyed by their ID for O(1) lookup.
    """

    def __init__(self) -> None:
        """Initialize an empty task store."""
        self._tasks: dict[int, Task] = {}
        self._next_id: int = 1

    def add(self, title: str, description: str = "") -> int:
        """
        Add a new task to the store.

        Args:
            title: The task title (assumed already validated).
            description: The task description (default empty string).

        Returns:
            The ID assigned to the new task.
        """
        task_id = self._next_id
        task = Task(
            id=task_id,
            title=title.strip(),
            description=description,
            completed=False
        )
        self._tasks[task_id] = task
        self._next_id += 1
        return task_id

    def get_all(self) -> list[Task]:
        """
        Get all tasks sorted by ID.

        Returns:
            A list of all tasks, sorted by ID in ascending order.
        """
        return sorted(self._tasks.values(), key=lambda t: t.id)

    def get(self, task_id: int) -> Task | None:
        """
        Get a task by its ID.

        Args:
            task_id: The ID of the task to retrieve.

        Returns:
            The Task if found, None otherwise.
        """
        return self._tasks.get(task_id)

    def toggle(self, task_id: int) -> bool | None:
        """
        Toggle the completed status of a task.

        Args:
            task_id: The ID of the task to toggle.

        Returns:
            The new completed status if task was found, None if not found.
        """
        task = self._tasks.get(task_id)
        if task is None:
            return None
        task.completed = not task.completed
        return task.completed

    def update(
        self,
        task_id: int,
        title: str | None = None,
        description: str | None = None
    ) -> bool:
        """
        Update a task's title and/or description.

        Args:
            task_id: The ID of the task to update.
            title: New title (if provided and not None).
            description: New description (if provided and not None).

        Returns:
            True if task was found and updated, False if not found.
        """
        task = self._tasks.get(task_id)
        if task is None:
            return False

        if title is not None:
            task.title = title.strip()
        if description is not None:
            task.description = description

        return True

    def delete(self, task_id: int) -> bool:
        """
        Delete a task by its ID.

        Args:
            task_id: The ID of the task to delete.

        Returns:
            True if task was found and deleted, False if not found.
        """
        if task_id not in self._tasks:
            return False
        del self._tasks[task_id]
        return True
