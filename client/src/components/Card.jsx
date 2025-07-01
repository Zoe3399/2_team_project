import React from "react";
import PropTypes from "prop-types";

export default function Card({ title, description, detail, buttonText, link, graphContent }) {
  return (
    <div className="card">
      <div className="card-content">
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

Card.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.node.isRequired,
  detail: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  graphContent: PropTypes.node.isRequired,
};