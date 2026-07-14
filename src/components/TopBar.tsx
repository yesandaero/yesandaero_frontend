import { useLocation } from 'react-router-dom';
import { TAB_META, tabKeyForPath } from '../data/constants';

export function TopBar() {
  const { pathname } = useLocation();
  const tab = tabKeyForPath(pathname);
  const meta = tab ? TAB_META[tab] : undefined;
  const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' });

  if (!meta) return null;

  return (
    <div className="topbar">
      <div>
        <h1>{meta.title}</h1>
        <div className="sub">{meta.sub}</div>
      </div>
      <div className="topbar-right">
        <span className="date-pill">{today}</span>
      </div>
    </div>
  );
}
