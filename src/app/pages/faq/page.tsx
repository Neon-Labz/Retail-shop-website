'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

function FaqAccordion({ items, defaultOpen = 0 }: { items: { question: string; answer: string }[]; defaultOpen?: number | null }) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen);
  const faqRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <div>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        const isFirst = i === 0;
        const isLast = i === items.length - 1;
        return (
          <div key={i} className={`${isFirst ? 'border-t-0' : 'border-t border-[#e5e5e5]'} ${isLast ? 'border-b-0' : ''}`}>
            <button
              onClick={() => toggle(i)}
              className="fa-faq-btn flex items-center justify-between w-full py-[22px] text-[24px] font-semibold text-[#222] bg-transparent border-none cursor-pointer text-left gap-[16px]"
            >
              <span className="flex-1">{item.question}</span>
              <span className="inline-flex items-center justify-center shrink-0 w-[24px] h-[24px] relative">
                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" fill="none" viewBox="0 0 10 10" width="20" height="20"
                  className={`absolute transition-[opacity,transform] duration-[350ms] ease-in-out ${isOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`}>
                  <path fillRule="evenodd" clipRule="evenodd" d="M1 4.51a.5.5 0 000 1h3.5l.01 3.5a.5.5 0 001-.01V5.5l3.5-.01a.5.5 0 00-.01-1H5.5L5.49.99a.5.5 0 00-1 .01v3.5l-3.5.01H1z" fill="currentColor" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" fill="none" viewBox="0 0 10 2" width="20" height="20"
                  className={`absolute transition-[opacity,transform] duration-[350ms] ease-in-out ${isOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`}>
                  <path fillRule="evenodd" clipRule="evenodd" d="M.5 1C.5.7.7.5 1 .5h8a.5.5 0 110 1H1A.5.5 0 01.5 1z" fill="currentColor" />
                </svg>
              </span>
            </button>
            <div
              ref={(el) => { faqRefs.current[i] = el; }}
              className={`overflow-hidden transition-[max-height,opacity] duration-[500ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${isOpen ? 'opacity-100' : 'opacity-0'}`}
              style={{
                maxHeight: isOpen ? `${faqRefs.current[i]?.scrollHeight || 500}px` : '0',
              }}
            >
              <div className="pb-[22px] text-[14px] text-[#555] leading-[1.7] whitespace-pre-line">
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function FAQPage() {
  return (
    <>
      <div className="fa-faq-page-header">
        <div className="container-main">
          <h1 className="fa-faq-h1">FAQ</h1>
          <div className="flex items-center justify-center gap-[8px] text-[14px]">
            <Link href="/" className="text-[#777] underline underline-offset-[3px]">Home</Link>
            <span className="text-[#bbb]">/</span>
            <span className="text-[#222]">FAQ</span>
          </div>
        </div>
      </div>

      <div className="container-main fa-faq-section">
        <h2 className="fa-faq-section-h2">Shopping Information</h2>
        <div className="fa-faq-grid">
          <div>
            <FaqAccordion
              defaultOpen={null}
              items={[
                {
                  question: 'How can I place an order?',
                  answer: 'To place an order, simply browse our online store and add the desired items to your shopping cart. Proceed to the checkout page, where you\'ll enter your shipping and payment details. Once confirmed, your order will be processed, and you\'ll receive a confirmation email.',
                },
                {
                  question: 'What payment methods do you accept?',
                  answer: 'We accept Visa, Mastercard, American Express, PayPal, and other major payment methods. All transactions are secured with SSL encryption.',
                },
                {
                  question: 'Do you offer international shipping?',
                  answer: 'Yes, we offer international shipping to most countries. Shipping rates and delivery times vary by location. Please check our shipping page for more details.',
                },
                {
                  question: 'What are your shipping times?',
                  answer: 'Domestic orders typically arrive within 3-7 business days. International orders may take 7-21 business days depending on the destination.',
                },
              ]}
            />
          </div>
          <div className="fa-faq-img-wrap">
            <Image
              src="/fashion/faq/faq2.webp"
              alt="Shopping Information"
              fill
              className="object-contain object-center"
              sizes="(max-width: 991px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>

      <div className="fa-faq-section-2">
        <div className="container-main fa-faq-section">
          <h2 className="fa-faq-section-h2">Payment Information</h2>
          <div className="fa-faq-grid">
            <div>
              <FaqAccordion
                defaultOpen={null}
                items={[
                  {
                    question: 'What payment methods do you accept?',
                    answer: 'We accept a wide range of payment methods including Visa, Mastercard, American Express, PayPal, Apple Pay, and Google Pay. All transactions are processed securely.',
                  },
                  {
                    question: 'Is my payment information secure?',
                    answer: '1. Yes, we take the security of your payment information seriously. Our website uses encrypted connections (SSL) to protect your personal and payment details, ensuring a safe and secure transaction.\n\n2.',
                  },
                  {
                    question: 'Do you accept payment in multiple currencies?',
                    answer: 'Yes, we accept payments in multiple currencies. The available currencies will be displayed at checkout based on your location.',
                  },
                  {
                    question: 'Can I request a refund for my payment?',
                    answer: 'Yes, if you are not satisfied with your purchase, you can request a refund within 30 days of delivery. Please contact our support team for assistance.',
                  },
                ]}
              />
            </div>
            <div className="fa-faq-img-wrap">
              <Image
                src="/fashion/faq/faq1.webp"
                alt="Payment Information"
                fill
                className="object-contain object-center"
                sizes="(max-width: 991px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container-main fa-faq-section">
        <h2 className="fa-faq-section-h2">Order &amp; Returns</h2>
        <div className="fa-faq-full-width">
          <FaqAccordion
            defaultOpen={null}
            items={[
              {
                question: 'How long does it take to process an order?',
                answer: 'Orders are typically processed within 1-3 business days. Once your order is shipped, you will receive a tracking number via email to monitor your delivery.',
              },
              {
                question: 'Do you offer international shipping?',
                answer: 'Yes, we offer international shipping to most countries. Shipping rates and delivery times vary depending on the destination. Please check our shipping page for detailed information.',
              },
              {
                question: 'What is your return policy?',
                answer: 'Our return policy allows you to return eligible items within a specified period from the date of delivery. To be eligible for a return, the item must be in its original condition, unused, and in the original packaging. Certain items, such as personalized or intimate goods, may not be eligible for return due to hygiene reasons.',
              },
              {
                question: 'Can I exchange an item instead of returning it?',
                answer: 'Yes, we offer exchanges for items of equal or lesser value. Please contact our customer support team to initiate an exchange within 30 days of receiving your order.',
              },
            ]}
          />
        </div>
      </div>

      <style>{`
        .fa-faq-page-header { background-color: rgb(247, 248, 252); padding: 40px 0 50px; text-align: center; }
        .fa-faq-h1 { font-size: 40px; font-weight: 600; color: #222; margin-bottom: 10px; }
        .fa-faq-section { padding-block: 80px; }
        .fa-faq-section-h2 { font-size: clamp(22px, 3vw, 28px); font-weight: 600; color: #222; text-align: left; margin-bottom: 32px; }
        .fa-faq-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
        .fa-faq-img-wrap { position: relative; width: 100%; min-height: 710px; }
        .fa-faq-section-2 { background-color: rgb(247, 248, 252); }
        .fa-faq-full-width { max-width: 1100px; margin: 0 auto; }
        @media (max-width: 991px) {
          .fa-faq-grid { grid-template-columns: 1fr; gap: 40px; }
          .fa-faq-img-wrap { order: -1; min-height: 400px; }
        }
        @media (max-width: 749px) {
          .fa-faq-page-header { padding: clamp(28px, 6vw, 40px) 0 clamp(30px, 7vw, 50px); }
          .fa-faq-h1 { font-size: clamp(26px, 6.5vw, 40px); }
          .fa-faq-section { padding-block: clamp(48px, 8vw, 80px); }
          .fa-faq-section-h2 { font-size: clamp(22px, 5.5vw, 36px); margin-bottom: clamp(28px, 5vw, 50px); }
          .fa-faq-img-wrap { min-height: clamp(280px, 60vw, 400px); }
          .fa-faq-btn { font-size: clamp(16px, 4.5vw, 20px) !important; padding: 16px 0 !important; }
        }
      `}</style>
    </>
  );
}
