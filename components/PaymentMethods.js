import { FaBuildingColumns, FaMoneyBillWave } from 'react-icons/fa6';
import { SiApplepay, SiMastercard, SiVisa } from 'react-icons/si';

// أيقونة تلقائية حسب اسم الوسيلة. الوسائل غير المعروفة تظهر باسمها، أو بشعارها إن وُضع رابط صورة.
const ICONS = [
  { test: /visa|فيزا/i, Icon: SiVisa, size: 34, color: '#1434CB' },
  { test: /master|ماستر/i, Icon: SiMastercard, size: 30, color: '#EB001B' },
  { test: /apple|أبل|ابل/i, Icon: SiApplepay, size: 36, color: '#000000' },
  { test: /cash|نقد|كاش/i, Icon: FaMoneyBillWave, size: 20, withLabel: true, color: '#16A34A' },
  { test: /bank|تحويل|حوالة/i, Icon: FaBuildingColumns, size: 18, withLabel: true, color: '#0D6EBD' },
];

export default function PaymentMethods({ value }) {
  const items = String(value || '')
    .split('\n')
    .map((line) => {
      const [name, ...rest] = line.split('|');
      return { name: name.trim(), logo: rest.join('|').trim() };
    })
    .filter((item) => item.name);
  if (!items.length) return null;

  return (
    <div className="payments" aria-label="وسائل الدفع">
      <div className="payments-list">
        {items.map((item) => {
          const match = ICONS.find((i) => i.test.test(item.name));
          return (
            <span className="pay" key={item.name} title={item.name}>
              {item.logo ? (
                <img src={item.logo} alt={item.name} loading="lazy" />
              ) : match ? (
                <>
                  <match.Icon size={match.size} color={match.color} aria-hidden="true" />
                  {match.withLabel ? <span>{item.name}</span> : <span className="sr-only">{item.name}</span>}
                </>
              ) : (
                <span dir="auto">{item.name}</span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
