import React from 'react';
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

const milestones = [
  { title: "Milestone 1", subtitle: "Milestone Subtitle", date: "Oct 05 1976", images: ["img1.jpg", "img2.jpg"], side: "left" },
  { title: "Milestone 2", date: "Oct 05 1976", description: "Company history details...", side: "right" },
  { title: "Milestone 3", date: "Oct 05 1976", description: "More history details...", side: "left" },
  { title: "Milestone 4", subtitle: "Milestone Subtitle", date: "Oct 05 1976", images: ["img3.jpg", "img4.jpg"], side: "right" },
  { title: "Milestone 5", date: "Oct 05 1976", description: "Further history details...", side: "left" },
  { title: "Milestone 6", date: "Oct 05 1976", description: "Additional history info...", side: "right" },
  { title: "Milestone 7", subtitle: "Milestone Subtitle", date: "Oct 05 1976", images: ["img5.jpg", "img6.jpg"], side: "left" },
];

const Timeline = () => {
  return (
    <VerticalTimeline lineColor="#FC8551">
      {milestones.map((milestone, index) => (
        <VerticalTimelineElement
          key={index}
          date={milestone.date}
          position={milestone.side}
          contentStyle={{
            background: '#fffaf5',
            color: '#303030',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            borderRadius: '8px',
          }}
          contentArrowStyle={{ borderRight: '7px solid #fffaf5' }}
          iconStyle={{
            background: '#FC8551',
            width: '14px',
            height: '14px',
            marginLeft: '-7px',
            top: '16px',
            boxShadow: 'none',
          }}
          icon={<div />} // just a dot, no actual icon
        >
          <h3 style={{ marginBottom: '0.25rem' }}>{milestone.title}</h3>
          {milestone.subtitle && (
            <h4 style={{ margin: '0 0 0.75rem', fontWeight: 400 }}>{milestone.subtitle}</h4>
          )}
          {milestone.description && (
            <p style={{ marginBottom: milestone.images ? '1rem' : '0' }}>{milestone.description}</p>
          )}
          {milestone.images && (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {milestone.images.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`milestone-${index}-img-${i}`}
                  style={{
                    width: '80px',
                    height: '50px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                  }}
                />
              ))}
            </div>
          )}
        </VerticalTimelineElement>
      ))}
    </VerticalTimeline>
  );
};

export default Timeline;
