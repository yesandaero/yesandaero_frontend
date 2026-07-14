import { useState } from 'react';
import { Icon } from '../components/icons/Icon';
import { Field } from '../components/Field';
import { STORE_CATEGORIES } from '../data/constants';
import { useApp } from '../state/context';
import * as v from '../utils/validation';
import type { StoreCategory } from '../api/types';

export function StoreOnboardingPage() {
  const { registerStore, logout } = useApp();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<StoreCategory>('KOREAN');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [phone, setPhone] = useState('');
  const [avgPrice, setAvgPrice] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const clearErr = (key: string) => setErrors((e) => ({ ...e, [key]: undefined }));

  function submit() {
    const next = {
      name: v.required(name, '가게 이름'),
      phone: v.phone(phone),
      address: v.required(address, '주소'),
      latitude: v.numberInRange(latitude, '위도', -90, 90),
      longitude: v.numberInRange(longitude, '경도', -180, 180),
      avgPrice: v.positiveNumber(avgPrice, '1인 평균 가격'),
    };
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
        <div className="field-row">
          <Field label="위도" error={errors.latitude}>
            <input type="number" placeholder="36.3624" value={latitude} onChange={(e) => { setLatitude(e.target.value); clearErr('latitude'); }} />
          </Field>
          <Field label="경도" error={errors.longitude}>
            <input type="number" placeholder="127.3568" value={longitude} onChange={(e) => { setLongitude(e.target.value); clearErr('longitude'); }} />
          </Field>
        </div>
        <Field label="1인 평균 가격 (원)" error={errors.avgPrice}>
          <input type="number" placeholder="9000" min={0} step={100} value={avgPrice} onChange={(e) => { setAvgPrice(e.target.value); clearErr('avgPrice'); }} />
        </Field>
        <Field label={<>가게 소개 <span style={{ fontWeight: 400, color: 'var(--muted)' }}>(선택)</span></>}>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </Field>

        <button className="btn btn-primary" style={{ width: '100%' }} onClick={submit}>가게 등록하고 시작하기</button>
        <div className="auth-foot"><span onClick={logout}>다른 계정으로 로그인</span></div>
      </div>
    </div>
  );
}
