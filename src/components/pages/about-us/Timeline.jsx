import { useRef, useState, useEffect } from 'react';
import milestones from '../../../data/milestones.json';
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

const ANIM_DURATION = 200;

const Timeline = () => {
  const [hoverSrc, setHoverSrc] = useState(null);
  const [animIn, setAnimIn] = useState(false);
  const hideTimer = useRef(null);

  const showOverlay = (src) => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setHoverSrc(src);
  };

  const scheduleHide = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setAnimIn(false);
    hideTimer.current = setTimeout(() => setHoverSrc(null), ANIM_DURATION);
  };

  useEffect(() => {
    if (hoverSrc) {
      requestAnimationFrame(() => setAnimIn(true));
    }
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [hoverSrc]);

  return (
    <div className="timeline-container">
      <VerticalTimeline lineColor="#FC8551">
        {milestones.map((milestone, index) => (
          <VerticalTimelineElement
            key={index}
            date={
              <span
                style={{
                  color: '#FC8551',
                  fontWeight: 700,
                  fontSize: '2rem',
                }}
              >
                {milestone.date}
              </span>
            }
            position={milestone.side}
            contentStyle={{
              background: '#fffaf5',
              color: '#303030',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              borderRadius: '12px',
              padding: '2rem',
            }}
            contentArrowStyle={{ borderRight: '10px solid #fffaf5' }}
            iconStyle={{
              background: '#FC8551',
              width: '20px',
              height: '20px',
              marginLeft: '-10px',
              top: '20px',
              boxShadow: 'none',
            }}
            icon={<div />}
          >
            {/* Title */}
            <h3
              style={{
                marginBottom: '0.5rem',
                fontSize: '2rem',
                fontWeight: 700,
                lineHeight: 1.3,
              }}
            >
              {milestone.title}
            </h3>

            {/* Subtitle */}
            {milestone.subtitle && (
              <h4
                style={{
                  margin: '0 0 1rem',
                  fontWeight: 500,
                  fontSize: '1.5rem',
                  lineHeight: 1.4,
                }}
              >
                {milestone.subtitle}
              </h4>
            )}

            {/* Images */}
            {milestone.images && (
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                {milestone.images.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`milestone-${index}-img-${i}`}
                    className={`timeline-image milestone-${index}-img-${i}`}
                    onMouseEnter={() => showOverlay(src)}
                    onMouseLeave={scheduleHide}
                    onClick={() => showOverlay(src)} // touch fallback
                    style={{
                      width: '140px',
                      height: '90px',
                      objectFit: 'cover',
                      objectPosition: 'center center', // default, can override in CSS
                      borderRadius: '6px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      cursor: 'zoom-in',
                    }}
                  />
                ))}
              </div>
            )}

            {/* Description */}
            {milestone.description && (
              <p
                style={{
                  marginBottom: milestone.images ? '1.25rem' : '0',
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                  fontWeight: 400,
                }}
              >
                {milestone.description}
              </p>
            )}
          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>

      {/* Hover Overlay with smooth animation */}
      {hoverSrc && (
        <div
          onMouseEnter={() => {
            if (hideTimer.current) clearTimeout(hideTimer.current);
            setAnimIn(true);
          }}
          onMouseLeave={scheduleHide}
          onClick={scheduleHide}
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            cursor: 'zoom-out',
            padding: '2rem',
            opacity: animIn ? 1 : 0,
            transition: `opacity ${ANIM_DURATION}ms ease`,
          }}
        >
          <img
            src={hoverSrc}
            alt="Full view"
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              borderRadius: '10px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              objectFit: 'contain',
              userSelect: 'none',
              transform: animIn ? 'scale(1)' : 'scale(0.98)',
              opacity: animIn ? 1 : 0.95,
              transition: `transform ${ANIM_DURATION}ms ease, opacity ${ANIM_DURATION}ms ease`,
            }}
            draggable={false}
          />
        </div>
      )}
    </div>
  );
};

export default Timeline;
