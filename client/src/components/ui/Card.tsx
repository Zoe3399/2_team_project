import React from "react";
import "./Card.css";

// props 타입 정의
interface CardProps {
  title: string;
  description: React.ReactNode;
  detail: string;
  buttonText: string;
  link: string;
  graphContent: React.ReactNode;
}

export default function Card({ title, description, detail, buttonText, link, graphContent }: CardProps) {
  return (
    <div className="card">
      <div className="card-content">
        {/* Title 추가 */}
        <h2 className="card-title">{title}</h2>

        <div className="card-body">
          <div className="card-graph">{graphContent}</div>
          <div className="card-description">{description}</div>
        </div>

        <div className="card-footer">
          <p>{detail}</p>
          <button onClick={() => (window.location.href = link)}>{buttonText}</button>
        </div>
      </div>
    </div>
  );
}