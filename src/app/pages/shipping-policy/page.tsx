'use client';

import Link from 'next/link';

export default function ShippingPolicyPage() {
  return (
    <>
      <div className="fa-sp-page-header">
        <div className="container-main">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '14px', marginBottom: '12px' }}>
            <Link href="/" style={{ color: '#777', textDecoration: 'underline', textUnderlineOffset: '3px' }}>Home</Link>
            <span style={{ color: '#bbb' }}>/</span>
            <span style={{ color: '#222' }}>Shipping policy</span>
          </div>
          <h1 className="fa-sp-h1">Shipping policy</h1>
        </div>
      </div>

      <div className="container-main fa-sp-content-wrap">
        <div className="fa-sp-prose">
          <p style={para}>Thank you for visiting and shopping with us. The following terms and conditions constitute our Shipping Policy.</p>

          <h2 className="fa-sp-h2">Shipment Processing Time</h2>
          <p style={para}>All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays.</p>
          <p style={para}>If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery. If there will be a significant delay in shipment of your order, we will contact you via email or telephone.</p>

          <h2 className="fa-sp-h2">Shipping Rates &amp; Delivery Estimates</h2>
          <p style={para}>Shipping charges for your order will be calculated and displayed at checkout. Standard shipping across Sri Lanka is flat rate LKR 350.00.</p>
          <p style={para}>Standard Delivery: 2-4 business days.</p>

          <h2 className="fa-sp-h2">Shipment Confirmation &amp; Order Tracking</h2>
          <p style={para}>You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours.</p>

          <h2 className="fa-sp-h2">Customs, Duties and Taxes</h2>
          <p style={para}>We are not responsible for any customs and taxes applied to your order. All fees imposed during or after shipping are the responsibility of the customer.</p>

          <h2 className="fa-sp-h2">Damages</h2>
          <p style={{ marginBottom: '0' }}>If you received your order damaged, please contact us immediately to file a claim. Please save all packaging materials and damaged goods before filing a claim.</p>
        </div>
      </div>

      <style>{`
        .fa-sp-page-header { background-color: rgb(247, 248, 252); padding: 40px 0 50px; text-align: center; }
        .fa-sp-h1 { font-size: 40px; font-weight: 600; color: #222; }
        .fa-sp-content-wrap { padding-block: 60px 100px; }
        .fa-sp-prose { max-width: 680px; margin: 0 auto; font-size: 15px; color: #555; line-height: 1.8; }
        .fa-sp-h2 { font-size: 22px; font-weight: 700; color: #222; margin-bottom: 14px; margin-top: 40px; }
        @media (max-width: 749px) {
          .fa-sp-page-header { padding: clamp(28px, 6vw, 40px) 0 clamp(30px, 7vw, 50px); }
          .fa-sp-h1 { font-size: clamp(26px, 6.5vw, 40px); }
          .fa-sp-content-wrap { padding-block: clamp(36px, 7vw, 60px) clamp(60px, 12vw, 100px); }
          .fa-sp-prose { font-size: clamp(13px, 3.8vw, 15px); }
          .fa-sp-h2 { font-size: clamp(17px, 4.5vw, 22px); margin-top: clamp(28px, 6vw, 40px); }
        }
      `}</style>
    </>
  );
}

const para: React.CSSProperties = { marginBottom: '20px' };
