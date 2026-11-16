export default function Flash({ params, okText = 'تم الحفظ بنجاح.' }) {
  if (params?.error) return <div className="flash err">{String(params.error)}</div>;
  if (params?.ok) return <div className="flash ok">{okText}</div>;
  return null;
}
