export default function StatusBadge({ status }) {
  const type = status?.toLowerCase().replaceAll(' ', '-') || 'new';
  return <span className={`status-badge status-${type}`}><i />{status}</span>;
}
