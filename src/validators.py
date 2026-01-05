"""
Input validation functions for the Todo CLI application.

Contains validators for task titles, descriptions, and IDs.
"""


def validate_title(title: str) -> tuple[bool, str]:
    """
    Validate a task title.

    Args:
        title: The title string to validate.

    Returns:
        A tuple of (is_valid, error_message).
        If valid, error_message is empty string.
    """
    stripped = title.strip()
    if not stripped:
        return False, "Title is required (1-200 characters)"
    if len(stripped) > 200:
        return False, "Title must not exceed 200 characters"
    return True, ""


def validate_description(description: str) -> tuple[bool, str]:
    """
    Validate a task description.

    Args:
        description: The description string to validate.

    Returns:
        A tuple of (is_valid, error_message).
        If valid, error_message is empty string.
    """
    if len(description) > 1000:
        return False, "Description must not exceed 1000 characters"
    return True, ""


def validate_task_id(input_str: str) -> tuple[int | None, str]:
    """
    Parse and validate a task ID from user input.

    Args:
        input_str: The raw input string from the user.

    Returns:
        A tuple of (parsed_id, error_message).
        If valid, error_message is empty string and parsed_id is the integer.
        If invalid, parsed_id is None and error_message describes the issue.
    """
    stripped = input_str.strip()
    if not stripped:
        return None, "Invalid input. Please enter a numeric task ID."

    try:
        task_id = int(stripped)
    except ValueError:
        return None, "Invalid input. Please enter a numeric task ID."

    if task_id <= 0:
        return None, "Invalid ID. Task IDs are positive numbers."

    return task_id, ""
