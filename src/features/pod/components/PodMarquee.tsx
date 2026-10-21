'use client';

function IconBolt() {
  return (
    <svg className="icon icon-accordion" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width={50} height={50}>
      <path d="M14.6792 0.161747C14.8796 0.280525 14.9715 0.522024 14.9006 0.743992L12.5162 8.21151L16.6937 9.21166C16.8685 9.2535 17.0074 9.38595 17.0575 9.55856C17.1076 9.73117 17.0612 9.91739 16.936 10.0463L7.56282 19.6949C7.39667 19.8659 7.13287 19.8958 6.93265 19.7663C6.73242 19.6368 6.65151 19.384 6.73935 19.1623L9.70397 11.6806L5.23445 10.6106C5.06054 10.5689 4.9221 10.4376 4.87139 10.2661C4.82068 10.0946 4.86541 9.9091 4.9887 9.77957L14.0621 0.247179C14.2228 0.0784039 14.4787 0.042969 14.6792 0.161747ZM6.3116 9.84018L10.4977 10.8424C10.6387 10.8761 10.7581 10.9694 10.8249 11.0981C10.8918 11.2267 10.8995 11.378 10.8461 11.5128L8.59272 17.1996L15.6066 9.97963L11.7597 9.05865C11.6245 9.02628 11.5089 8.93906 11.4406 8.81795C11.3723 8.69683 11.3575 8.55276 11.3998 8.42031L13.286 2.51296L6.3116 9.84018Z" />
    </svg>
  );
}

const items = [
  'RKF Wholesale & Retail Distributer',
  'Islandwide Fast Delivery Across Sri Lanka',
  'Best Wholesale & Retail Prices Guaranteed',
  'Premium Toys, Party & Event Essentials',
  'Bulk & Retail Orders Welcome',
  'Quality Products • Trusted Service',
];

export function PodMarquee() {
  return (
    <section className="pdmq-section">
      <div className="pdmq-track">
        {[0, 1].map((set) => (
          <div key={set} className="pdmq-inner" aria-hidden={set === 1 ? true : undefined}>
            {items.map((text, i) => (
              <span
                key={i}
                className={i % 2 === 0 ? 'pdmq-item pdmq-item--solid' : 'pdmq-item pdmq-item--ghost'}
              >
                {text}
                <span className="pdmq-bolt"><IconBolt /></span>
              </span>
            ))}
          </div>
        ))}
      </div>

      <style>{`
        .pdmq-section {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #0b1c3d 0%, #112d62 55%, #183e84 100%);
          height: 68px;
          display: flex;
          align-items: center;
          box-shadow: 0 8px 24px rgba(11, 28, 61, 0.18);
        }
        
        .pdmq-section::before,
        .pdmq-section::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          height: 1.5px;
          background: rgba(147, 197, 253, 0.38);
          pointer-events: none;
          z-index: 2;
        }
        .pdmq-section::before { top: 6px; }
        .pdmq-section::after { bottom: 6px; }

        .pdmq-track {
          display: flex;
          width: max-content;
          animation: pdmqScroll 28s linear infinite;
        }
        .pdmq-section:hover .pdmq-track {
          animation-play-state: paused;
        }
        .pdmq-inner {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }
        .pdmq-item {
          display: inline-flex;
          align-items: center;
          gap: 24px;
          padding-right: 24px;
          white-space: nowrap;
          font-size: clamp(22px, 2.6vw, 32px);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .pdmq-item--solid {
          color: #ffffff;
        }
        .pdmq-item--ghost {
          color: #93c5fd;
        }
        .pdmq-bolt {
          color: #F15B41;
          display: inline-flex;
          align-items: center;
        }
        .pdmq-bolt svg {
          width: 28px;
          height: 28px;
        }
        @keyframes pdmqScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
