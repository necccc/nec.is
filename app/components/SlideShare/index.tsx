import classnames from "classnames";

import css from "./slideshare.module.css";

export const SlideShare = ({
  src,
  className = "",
  title = "SlideShare presentation",
}) => (
  <div className={classnames(css.embed, className)}>
    <iframe
      src={src}
      frameBorder="0"
      marginWidth="0"
      marginHeight="0"
      scrolling="no"
      title={title}
      allowfullscreen
    ></iframe>
  </div>
);
