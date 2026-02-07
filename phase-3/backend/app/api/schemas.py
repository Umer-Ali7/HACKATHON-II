"""Pydantic request/response schemas per openapi.yaml."""

from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=10000)
    conversation_id: Optional[int] = None


class ToolCallRecord(BaseModel):
    tool: str
    parameters: dict[str, Any]
    result: dict[str, Any]


class ChatResponse(BaseModel):
    conversation_id: int
    response: str
    tool_calls: list[ToolCallRecord]


class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    completed: bool
    created_at: datetime
    updated_at: Optional[datetime] = None


class CreateTaskRequest(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = None


class UpdateTaskRequest(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = None
    completed: Optional[bool] = None


class StatsResponse(BaseModel):
    total: int
    pending: int
    completed: int
    recent_tasks: list[TaskResponse]
    activity: list[dict[str, Any]]


class ConversationResponse(BaseModel):
    id: int
    created_at: datetime
    message_count: int
    last_message_preview: Optional[str] = None


class MessageResponse(BaseModel):
    id: int
    role: str
    content: str
    tool_calls: Optional[list[ToolCallRecord]] = None
    created_at: datetime


class ProfileResponse(BaseModel):
    id: str
    email: str
    display_name: Optional[str] = None
    theme_preference: Optional[str] = None


class UpdateProfileRequest(BaseModel):
    display_name: Optional[str] = Field(default=None, max_length=100)
    theme_preference: Optional[str] = None


class ErrorResponse(BaseModel):
    error: str
    detail: str


class SignupRequest(BaseModel):
    email: str = Field(min_length=5)
    password: str = Field(min_length=6)
    name: Optional[str] = Field(default=None, max_length=100)


class LoginRequest(BaseModel):
    email: str = Field(min_length=5)
    password: str


class AuthResponse(BaseModel):
    user_id: str
    email: str
    name: Optional[str] = None
    token: str
