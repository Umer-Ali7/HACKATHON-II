'use client';

import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from '../ui/Button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
  isLoading?: boolean;
}

function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = false,
  isLoading = false,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" closeOnBackdropClick={!isLoading}>
      <div className="text-center">
        {/* Icon */}
        <div
          className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
            isDanger ? 'bg-red-100' : 'bg-amber-100'
          }`}
        >
          <AlertTriangle
            className={`w-6 h-6 ${isDanger ? 'text-red-600' : 'text-amber-600'}`}
          />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>

        {/* Message */}
        <p className="text-gray-500 mb-6">{message}</p>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={isDanger ? 'danger' : 'primary'}
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export { ConfirmModal };
export type { ConfirmModalProps };
