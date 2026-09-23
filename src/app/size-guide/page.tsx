import type { Metadata } from "next";

export const metadata: Metadata = { title: "Size guide" };

const rows = [
  ["XS", "32", "26", "34"],
  ["S", "34", "28", "36"],
  ["M", "36", "30", "38"],
  ["L", "38", "32", "40"],
  ["XL", "40", "34", "42"],
];

export default function SizeGuidePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-8">
      <h1 className="font-serif text-4xl">Size guide</h1>
      <p className="mt-3 text-sm text-muted">
        Inches. Measure over undergarments you will actually wear. When in doubt, write to the atelier with a photograph of a well-fitting blouse.
      </p>
      <table className="mt-8 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-line text-[11px] uppercase tracking-[0.16em]">
            <th className="py-2">Size</th>
            <th>Bust</th>
            <th>Waist</th>
            <th>Hip</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]} className="border-b border-line">
              {r.map((c) => (
                <td key={c} className="py-3">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-6 text-sm text-muted">Sarees are free size. Blouse fabric is unstitched unless noted.</p>
    </div>
  );
}
