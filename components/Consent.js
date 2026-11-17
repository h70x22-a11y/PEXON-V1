import Link from 'next/link';

// خانة الموافقة على سياسة الخصوصية (مطلوبة في نماذج الموقع)
export default function Consent({ label, linkText, controlled }) {
  return (
    <div className="field consent">
      <label className="check">
        <input type="checkbox" name="consent" value="yes" required {...(controlled || {})} />
        <span>
          {label}{' '}
          <Link href="/privacy" target="_blank">{linkText}</Link>
        </span>
      </label>
    </div>
  );
}
