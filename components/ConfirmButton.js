'use client';

export default function ConfirmButton({ children, message = 'متأكد من الحذف؟', className = 'btn danger small' }) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
