import { useState } from 'react';
import { Icon } from '../components/icons/Icon';
import { Field } from '../components/Field';
import { STORE_CATEGORIES } from '../data/constants';
import { useApp } from '../state/context';
import * as v from '../utils/validation';
import type { RegisterStoreMenuRequest, StoreCategory } from '../api/types';

type MenuDraft = Omit<RegisterStoreMenuRequest, 'price' | 'discountedPrice'> & {
  price: string;
  discountedPrice: string;
};

const EMPTY_MENU: MenuDraft = { name: '', description: '', price: '', discountedPrice: '' };

export function StoreOnboardingPage() {
  const { registerStore, logout } = useApp();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<StoreCategory>('KOREAN');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [avgPrice, setAvgPrice] = useState('');
  const [description, setDescription] = useState('');
  const [openTime, setOpenTime] = useState('09:00');
  const [closeTime, setCloseTime] = useState('21:00');
  const [minOrderAmount, setMinOrderAmount] = useState('');
  const [menus, setMenus] = useState<MenuDraft[]>([{ ...EMPTY_MENU }]);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const clearErr = (key: string) => setErrors((e) => ({ ...e, [key]: undefined }));

  function updateMenu(index: number, key: keyof MenuDraft, value: string) {
    setMenus((current) => current.map((menu, i) => (i === index ? { ...menu, [key]: value } : menu)));
    clearErr(`menu-${index}-${key}`);
  }

  function captureCurrentLocation() {
    if (!navigator.geolocation) {
      setErrors((current) => ({ ...current, location: '이 브라우저에서는 위치 확인을 지원하지 않아요' }));
      return;
    }
    setLocationLoading(true);
    clearErr('location');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLatitude(String(coords.latitude));
        setLongitude(String(coords.longitude));
        setLocationLoading(false);
      },
      (error) => {
        const message = error.code === error.PERMISSION_DENIED
          ? '위치 권한을 허용해주세요'
          : '현재 위치를 확인하지 못했어요. 잠시 후 다시 시도해주세요';
        setErrors((current) => ({ ...current, location: message }));
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  }

  function submit() {
    const next: Record<string, string | undefined> = {
      name: v.required(name, '가게 이름'),
      phone: v.phone(phone),
      address: v.required(address, '주소'),
      location: latitude && longitude ? undefined : '현재 위치를 확인해주세요',
      avgPrice: v.positiveNumber(avgPrice, '1인 평균 가격'),
      description: v.required(description, '가게 소개'),
      openTime: v.required(openTime, '영업 시작 시간'),
      closeTime: v.required(closeTime, '영업 종료 시간'),
      minOrderAmount: v.nonNegativeNumber(minOrderAmount, '최소 주문 금액'),
    };
    menus.forEach((menu, index) => {
      next[`menu-${index}-name`] = v.required(menu.name, '메뉴 이름');
      next[`menu-${index}-description`] = v.required(menu.description, '메뉴 설명');
      next[`menu-${index}-price`] = v.positiveNumber(menu.price, '메뉴 가격');
      next[`menu-${index}-discountedPrice`] = v.nonNegativeNumber(menu.discountedPrice, '할인가');
      if (!next[`menu-${index}-price`] && !next[`menu-${index}-discountedPrice`] && Number(menu.discountedPrice) > Number(menu.price)) {
        next[`menu-${index}-discountedPrice`] = '할인가는 정상 가격보다 클 수 없어요';
      }
    });
    setErrors(next);
    if (v.hasErrors(next)) return;
    registerStore({
      name: name.trim(),
      category,
      address: address.trim(),
      latitude: Number(latitude),
      longitude: Number(longitude),
      phone: phone.trim(),
      avgPrice: Number(avgPrice),
      description: description.trim(),
      openTime,
      closeTime,
      minOrderAmount: Number(minOrderAmount),
      menus: menus.map((menu) => ({
        name: menu.name.trim(),
        description: menu.description.trim(),
        price: Number(menu.price),
        discountedPrice: Number(menu.discountedPrice),
      })),
    });
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="mark"><Icon name="store" size={26} /></div>
          <div className="t1">가게 등록</div>
          <div className="t2">손님을 맞이할 가게 정보를 입력해주세요</div>
        </div>

        <Field label="가게 이름" error={errors.name}>
          <input type="text" placeholder="예: 이모네 국밥" value={name} onChange={(e) => { setName(e.target.value); clearErr('name'); }} />
        </Field>
        <div className="field-row">
          <Field label="카테고리">
            <select value={category} onChange={(e) => setCategory(e.target.value as StoreCategory)}>
              {STORE_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </Field>
          <Field label="전화번호" error={errors.phone}>
            <input type="text" placeholder="042-000-0000" value={phone} onChange={(e) => { setPhone(e.target.value); clearErr('phone'); }} />
          </Field>
        </div>
        <Field label="주소" error={errors.address}>
          <input type="text" placeholder="대전시 유성구 ..." value={address} onChange={(e) => { setAddress(e.target.value); clearErr('address'); }} />
        </Field>
        <Field label="실제 가게 위치" error={errors.location} hint="기기의 위치 권한을 사용해 실제 좌표를 확인합니다.">
          <button type="button" className="btn btn-outline" style={{ width: '100%' }} onClick={captureCurrentLocation} disabled={locationLoading}>
            {locationLoading ? '현재 위치 확인 중...' : latitude && longitude ? '현재 위치 다시 가져오기' : '현재 위치 가져오기'}
          </button>
          {latitude && longitude && <div className="empty-inline" style={{ marginTop: 8 }}>현재 위치가 확인됐어요.</div>}
        </Field>
        <Field label="1인 평균 가격 (원)" error={errors.avgPrice}>
          <input type="number" placeholder="9000" min={0} step={100} value={avgPrice} onChange={(e) => { setAvgPrice(e.target.value); clearErr('avgPrice'); }} />
        </Field>
        <div className="field-row">
          <Field label="영업 시작 시간" error={errors.openTime}>
            <input type="time" value={openTime} onChange={(e) => { setOpenTime(e.target.value); clearErr('openTime'); }} />
          </Field>
          <Field label="영업 종료 시간" error={errors.closeTime}>
            <input type="time" value={closeTime} onChange={(e) => { setCloseTime(e.target.value); clearErr('closeTime'); }} />
          </Field>
        </div>
        <Field label="최소 주문 금액 (원)" error={errors.minOrderAmount}>
          <input type="number" placeholder="8000" min={0} step={100} value={minOrderAmount} onChange={(e) => { setMinOrderAmount(e.target.value); clearErr('minOrderAmount'); }} />
        </Field>
        <Field label="가게 소개" error={errors.description}>
          <textarea value={description} onChange={(e) => { setDescription(e.target.value); clearErr('description'); }} />
        </Field>

        {menus.map((menu, index) => (
          <div className="form-section" key={index}>
            <div className="section-title">메뉴 {index + 1}</div>
            <Field label="메뉴 이름" error={errors[`menu-${index}-name`]}>
              <input value={menu.name} placeholder="제육볶음" onChange={(e) => updateMenu(index, 'name', e.target.value)} />
            </Field>
            <Field label="메뉴 설명" error={errors[`menu-${index}-description`]}>
              <input value={menu.description} placeholder="매콤한 제육" onChange={(e) => updateMenu(index, 'description', e.target.value)} />
            </Field>
            <div className="field-row">
              <Field label="가격 (원)" error={errors[`menu-${index}-price`]}>
                <input type="number" min={1} step={100} value={menu.price} onChange={(e) => updateMenu(index, 'price', e.target.value)} />
              </Field>
              <Field label="할인가 (원)" error={errors[`menu-${index}-discountedPrice`]}>
                <input type="number" min={0} step={100} value={menu.discountedPrice} onChange={(e) => updateMenu(index, 'discountedPrice', e.target.value)} />
              </Field>
            </div>
            {menus.length > 1 && (
              <button type="button" className="btn btn-ghost" onClick={() => setMenus((current) => current.filter((_, i) => i !== index))}>메뉴 삭제</button>
            )}
          </div>
        ))}
        <button type="button" className="btn btn-ghost" style={{ width: '100%', marginBottom: 12 }} onClick={() => setMenus((current) => [...current, { ...EMPTY_MENU }])}>메뉴 추가</button>

        <button className="btn btn-primary" style={{ width: '100%' }} onClick={submit}>가게 등록하고 시작하기</button>
        <div className="auth-foot"><span onClick={logout}>다른 계정으로 로그인</span></div>
      </div>
    </div>
  );
}
