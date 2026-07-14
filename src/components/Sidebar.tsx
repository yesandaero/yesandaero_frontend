import { NavLink } from 'react-router-dom';
import { Icon } from './icons/Icon';
import { NAV } from '../data/constants';

export function Sidebar({
  storeName,
  storeCategory,
  onLogout,
}: {
  storeName: string;
  storeCategory: string;
  onLogout: () => void;
}) {
  return (
    <div className="sidebar">
      <div className="sidebar-store">
        <div className="name">{storeName}</div>
        <div className="cat">{storeCategory}</div>
      </div>
      <div className="sidebar-nav">
        {NAV.map((n) => (
          <NavLink key={n.key} to={n.path} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span className="ic"><Icon name={n.iconName} size={19} /></span>
            {n.label}
          </NavLink>
        ))}
      </div>
      <div className="sidebar-foot">
        <button className="logout-btn" onClick={onLogout}>
          <span className="ic"><Icon name="logout" size={18} /></span>
          로그아웃
        </button>
      </div>
    </div>
  );
}
