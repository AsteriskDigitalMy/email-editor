import { Box } from "@mui/material";
import React, { useState } from "react";
import {
  getCamelCasedAttributes,
  objectToCSS
} from "@/lib/util/get-camel-cased-attr";
import ButtonPreview from "@/components/preview-items/button.preview";
import TextPreview from "@/components/preview-items/text.preview";
import HoverInfo from "@/lib/ui/hover-info";
import useEmailDataStore from "@/store/email";
import { useDrop } from "react-dnd";

interface ITextPreview {
  section: any;
  index: number;
  path: string;
}

const defaultStyle = {
  position: "relative",
  "&:hover": {
    outline: "2px dashed white"
  },
  backgroundRepeat: "no-repeat !important",
  backgroundPosition: "center !important",
  backgroundSize: "cover !important",
  verticalAlign: "top",
  bgcolor: "yellow"
};

const activeStyle = {
  ...defaultStyle,
  outline: "2px dashed white"
};

const HeroPreview = ({ section, index, path }: ITextPreview) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const { setActiveNode, pushTagElement } = useEmailDataStore();

  const [collectedProps, drop] = useDrop(() => ({
    accept: ["mj-text", "mj-spacer", "mj-button"],
    drop: (item: any, monitor) => {
      if (!monitor.didDrop()) {
        const nestedPath = `${path}.children`;
        pushTagElement(item["type"], nestedPath);
      }
    }
  }));

  const loadHtmlElements = (pSection: any, nIndex: number) => {
    switch (pSection.tagName) {
      case "mj-button": {
        return (
          <ButtonPreview
            section={pSection}
            textIndex={nIndex}
            index={index}
            key={nIndex}
            path={`${path}.children.${nIndex}`}
          />
        );
      }

      case "mj-text": {
        return (
          <TextPreview
            section={pSection}
            index={index}
            textIndex={nIndex}
            key={nIndex}
            path={`${path}.children.${nIndex}`}
          />
        );
      }

      default:
        break;
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    setActiveNode(null);
    setActiveNode({
      section,
      path,
      sectionIndex: index
    });

    setIsActive(true);
  };

  const onMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    setIsHovered(true);
    event.stopPropagation();
  };

  const onMouseLeave = (event: React.MouseEvent<HTMLElement>) => {
    setIsHovered(false);
    event.stopPropagation();
  };

  const children = section.children;
  const objectCss = objectToCSS(getCamelCasedAttributes(section.attributes));
  // const height = objectCss["height"];
  return (
    <Box
      id="hero-preview"
      ref={drop}
      sx={{
        ...(isActive ? activeStyle : defaultStyle),
        ...objectCss
        // height: `calc(${height} - 200px)`
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={handleClick}
    >
      {children &&
        children.map((element: any, nIndex: number) => {
          return loadHtmlElements(element, nIndex);
        })}
      {(isHovered || isActive) && <HoverInfo section={section} path={path} />}
    </Box>
  );
};

export default HeroPreview;