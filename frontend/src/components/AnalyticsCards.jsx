import React from 'react';
import { Package, TrendingUp, AlertTriangle, Box } from 'lucide-react';
import { StatCard } from './ui/StatCard';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function AnalyticsCards({ totalProducts, totalValue, lowStockProducts = [], outOfStockProducts = [] }) {
  return (
    /**
     * FIX: Added 'w-full' and 'items-stretch' to the grid.
     * This ensures that on smaller screens or during transitions, 
     * the cards maintain their intended width and don't "pill" (shrink).
     */
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch"
    >

      <motion.div variants={itemVariants}>
        <StatCard
          title="Total Products"
          value={totalProducts}
          icon={Package}
          color="blue"
          sub="Active in inventory"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <StatCard
          title="Inventory Value"
          value={`Rs. ${totalValue.toLocaleString('en-PK')}`}
          icon={TrendingUp}
          color="green"
          sub="Total valuation"
          trend="up"
          trendValue="12"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <StatCard
          title="Low Stock"
          value={lowStockProducts.length}
          icon={AlertTriangle}
          color="yellow"
          sub={lowStockProducts.length > 0 ? `${lowStockProducts.length} items to check` : "All healthy"}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <StatCard
          title="Out of Stock"
          value={outOfStockProducts.length}
          icon={Box}
          color="red"
          sub={outOfStockProducts.length > 0 ? "Needs immediate restock" : "All set"}
        />
      </motion.div>
    </motion.div>
  );
}