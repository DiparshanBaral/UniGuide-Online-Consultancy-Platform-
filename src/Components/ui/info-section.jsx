import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

export function InfoSection({ title, children, delay = 0, className = '' }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5, delay }}
      className={className} // Add this line to apply the className
    >
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </motion.div>
  );
}

InfoSection.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  delay: PropTypes.number,
  className: PropTypes.string, // Add this line for prop types
};
