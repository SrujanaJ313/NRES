import { useState, useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { mapToGenericKeys } from "../../../helpers/utils";
import { Checkbox, Typography } from "@mui/material";

export default function ExpandableTableRow({
  accordianLabelName,
  options,
  isDisabled,
  formik,
  fieldName,
}) {
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    if (isDisabled) {
      setExpanded(false);
    }
  }, [isDisabled]);
  const handleChange = () => {
    setExpanded(!expanded);
  };
  const modifiedOptions = mapToGenericKeys(options);
  return (
    <div style={{ width: "80%" }}>
      <Accordion
        expanded={expanded}
        onChange={handleChange}
        disabled={isDisabled}
        sx={{ padding: "5px" }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`${accordianLabelName}-content`}
          id={`${accordianLabelName}-header`}
          sx={{ marginLeft: "2px" }}
        >
          <Typography sx={{ fontSize: "14px" }}>
            {accordianLabelName}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {modifiedOptions?.map((option) => {
            return (
              <div key={option.id} style={{ display: "flex" }}>
                <Checkbox
                  checked={formik.values?.[fieldName]?.includes(option.id)}
                  onChange={() => {
                    const currentValue = formik.values?.[fieldName] || [];
                    if (currentValue.includes(option.id)) {
                      formik.setFieldValue(
                        fieldName,
                        currentValue.filter((id) => id !== option.id)
                      );
                    } else {
                      formik.setFieldValue(fieldName, [
                        ...currentValue,
                        option.id,
                      ]);
                    }
                  }}
                />
                <h3>{option.value}</h3>
              </div>
            );
          })}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

