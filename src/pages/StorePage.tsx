import { useState } from 'react';
import { STORE_CATEGORIES } from '../data/constants';
import { Field } from '../components/Field';
import * as v from '../utils/validation';
import type { StoreInfo } from '../types';
import type { StoreCategory, UpdateStoreRequest } from '../api/types';

export function StorePage({ store, onSave }: { store: StoreInfo; onSave: (partial: UpdateStoreRequest) => void }) {
  const [draft, setDraft] = useState({
    name: store.name,
    category: store.category,
    address: store.address,
    phone: store.phone,
    avgPrice: String(store.avgPrice),
    description: store.description,
  });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  function field<K extends keyof typeof draft>(key: K, value: (typeof draft)[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function save() {
    const next = {
      name: v.required(draft.name, '가게 이름'),
      phone: v.phone(draft.phone),
      address: v.required(draft.address, '주소'),
      avgPrice: v.positiveNumber(draft.avgPrice, '1인 평균 가격'),
    };
    setErrors(next);
    if (v.hasErrors(next)) return;
    onSave({
      name: draft.name.trim(),
      category: draft.category,
      address: draft.address.trim(),
      phone: draft.phone.trim(),
      avgPrice: Number(draft.avgPrice),
      description: draft.description.trim(),
    });
  }

  return (
    <div className="card">
      <div className="card-head">
        <div>
          <h2>기본 정보</h2>
          <div className="hint">고객에게 그대로 노출되는 정보예요</div>
        </div>
      </div>
      <Field label="가게 이름" error={errors.name}>
        <input type="text" value={draft.name} onChange={(e) => field('name', e.target.value)} />
      </Field>
      <div className="field-row">
        <Field label="카테고리">
          <select value={draft.category} onChange={(e) => field('category', e.target.value as StoreCategory)}>
            {STORE_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </Field>
        <Field label="전화번호" error={errors.phone}>
          <input type="text" placeholder="042-000-0000" value={draft.phone} onChange={(e) => field('phone', e.target.value)} />
        </Field>
      </div>
      <Field label="주소" error={errors.address}>
        <input type="text" value={draft.address} onChange={(e) => field('address', e.target.value)} />
      </Field>
      <Field label="1인 평균 가격 (원)" error={errors.avgPrice}>
        <input type="number" min={0} step={100} value={draft.avgPrice} onChange={(e) => field('avgPrice', e.target.value)} />
      </Field>
      <Field label="가게 소개">
        <textarea value={draft.description} onChange={(e) => field('description', e.target.value)} />
      </Field>
      <div className="form-actions">
        <button className="btn btn-primary" onClick={save}>가게 정보 저장</button>
      </div>
    </div>
  );
}
