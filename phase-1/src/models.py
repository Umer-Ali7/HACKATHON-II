"""
Data models for the Todo CLI application.

Contains the Task dataclass representing a single todo item.
"""

from dataclasses import dataclass


@dataclass
class Task:
    """
    Represents a single todo item.

    Attributes:
        id: Unique positive integer identifier (auto-assigned, immutable).
        title: Required string (1-200 characters).
        description: Optional string (0-1000 characters).
        completed: Boolean status flag (default: False).
    """

    id: int
    title: str
    description: str
    completed: bool = False
