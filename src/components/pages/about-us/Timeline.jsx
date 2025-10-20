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
    if (hoverSrc) requestAnimationFrame(() => setAnimIn(true));
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
            date={<span className="timeline-date">{milestone.date}</span>}
            position={milestone.side}
            icon={<div />}
            className="timeline-element"
          >
            <h3 className="timeline-title">{milestone.title}</h3>

            {milestone.subtitle && (
              <h4 className="timeline-subtitle">{milestone.subtitle}</h4>
            )}

            {milestone.images && (
              <div className="timeline-images">
                {milestone.images.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`milestone-${index}-img-${i}`}
                    className={`timeline-img milestone-${index}-img-${i}`}
                    onMouseEnter={() => showOverlay(src)}
                    onMouseLeave={scheduleHide}
                    onClick={() => showOverlay(src)}
                  />
                ))}
              </div>
            )}

            {milestone.description && (
              <p className="timeline-description">{milestone.description}</p>
            )}
          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>

      {hoverSrc && (
        <div
          className={`timeline-overlay ${animIn ? 'active' : ''}`}
          onMouseEnter={() => {
            if (hideTimer.current) clearTimeout(hideTimer.current);
            setAnimIn(true);
          }}
          onMouseLeave={scheduleHide}
          onClick={scheduleHide}
          role="dialog"
          aria-modal="true"
        >
          <img src={hoverSrc} alt="Full view" className="timeline-overlay-img" />
        </div>
      )}
    </div>
  );
};

export default Timeline;
