import { useEffect } from "react";
import TimelineItem from "./TimelineItem.jsx";
import "../../../styles/timeline.css";

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
  useEffect(() => {
    const items = document.querySelectorAll(".timeline__item");
    const progressLine = document.querySelector(".timeline::before");

    const updateTimeline = () => {
      let scrollY = window.scrollY + window.innerHeight * 0.75;
      let visibleCount = 0;

      items.forEach((item, index) => {
        const top = item.offsetTop;
        if (scrollY > top) {
          item.classList.add("visible");
          visibleCount = index + 1;
        } else {
          item.classList.remove("visible");
        }
      });

      // Update progress line height
      const totalItems = items.length;
      const percentage = (visibleCount / totalItems) * 100;
      if (progressLine) progressLine.style.height = `${percentage}%`;
    };

    window.addEventListener("scroll", updateTimeline);
    updateTimeline();

    return () => {
      window.removeEventListener("scroll", updateTimeline);
    };
  }, []);

  return (
    <div className="timeline">
      {milestones.map((milestone, index) => (
        <TimelineItem key={index} {...milestone} />
      ))}
    </div>
  );
};

export default Timeline;
