import { Card, CardContent } from "@/Components/ui/card";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

export function StatCard({ title, value, icon, delay = 0 }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5, delay }}
    >
      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <div className="text-primary">{icon}</div>
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node.isRequired,
  delay: PropTypes.number,
};
