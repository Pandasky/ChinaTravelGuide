import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Alert,
  Snackbar,
  Pagination,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ReplayIcon from '@mui/icons-material/Replay';

// Mock data
const mockOrders = [
  {
    id: 'ORD-2026-001',
    date: '2026-03-15T10:30:00Z',
    items: [
      { name: 'Beijing Travel Guide', type: 'guide', price: 9.99 },
    ],
    total: 9.99,
    status: 'completed',
    paymentMethod: 'Visa ending in 4242',
  },
  {
    id: 'ORD-2026-002',
    date: '2026-02-20T14:15:00Z',
    items: [
      { name: 'Shanghai Travel Guide', type: 'guide', price: 9.99 },
      { name: 'China Travel Basics', type: 'guide', price: 0 },
    ],
    total: 9.99,
    status: 'completed',
    paymentMethod: 'PayPal',
  },
  {
    id: 'ORD-2026-003',
    date: '2026-01-10T09:00:00Z',
    items: [
      { name: "Xi'an Travel Guide", type: 'guide', price: 7.99 },
    ],
    total: 7.99,
    status: 'completed',
    paymentMethod: 'Visa ending in 4242',
  },
  {
    id: 'ORD-2025-004',
    date: '2025-12-01T16:45:00Z',
    items: [
      { name: 'AI Assistant - Monthly Plan', type: 'subscription', price: 19.99 },
    ],
    total: 19.99,
    status: 'completed',
    paymentMethod: 'Visa ending in 4242',
  },
  {
    id: 'ORD-2025-005',
    date: '2025-11-15T11:20:00Z',
    items: [
      { name: 'AI Assistant - Monthly Plan', type: 'subscription', price: 19.99 },
    ],
    total: 19.99,
    status: 'refunded',
    paymentMethod: 'Visa ending in 4242',
    refundAmount: 19.99,
    refundDate: '2025-11-16T10:00:00Z',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return { color: '#28A745', label: 'Completed' };
    case 'pending':
      return { color: '#E67E22', label: 'Pending' };
    case 'failed':
      return { color: '#DC3545', label: 'Failed' };
    case 'refunded':
      return { color: '#6C757D', label: 'Refunded' };
    default:
      return { color: '#6C757D', label: status };
  }
};

export default function Orders() {
  const [selectedOrder, setSelectedOrder] = useState<typeof mockOrders[0] | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [page, setPage] = useState(1);

  const handleViewDetail = (order: typeof mockOrders[0]) => {
    setSelectedOrder(order);
    setDetailDialogOpen(true);
  };

  const handleDownloadInvoice = (order: typeof mockOrders[0]) => {
    setSelectedOrder(order);
    setInvoiceDialogOpen(true);
  };

  const handleRefundRequest = () => {
    setShowSuccess(true);
    setDetailDialogOpen(false);
  };

  return (
    <>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Order History
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        View and manage your purchase history
      </Typography>

      <Paper elevation={0} sx={{ overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#F8F9FA' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Items</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockOrders.map((order) => {
                const status = getStatusColor(order.status);
                return (
                  <TableRow key={order.id} hover>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>
                      {new Date(order.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>
                      <Box>
                        {order.items.map((item, i) => (
                          <Typography key={i} variant="body2">
                            {item.name}
                            {item.type === 'subscription' && (
                              <Chip label="Subscription" size="small" sx={{ ml: 1 }} />
                            )}
                          </Typography>
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        ${order.total.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={status.label}
                        size="small"
                        sx={{
                          backgroundColor: status.color,
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleViewDetail(order)}
                          title="View Details"
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        {order.status === 'completed' && (
                          <IconButton
                            size="small"
                            onClick={() => handleDownloadInvoice(order)}
                            title="Download Invoice"
                          >
                            <ReceiptIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <Pagination count={1} page={page} onChange={(_, v) => setPage(v)} />
        </Box>
      </Paper>

      {/* Order Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedOrder && (
          <>
            <DialogTitle>
              Order Details - {selectedOrder.id}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ py: 2 }}>
                {/* Order Status */}
                <Box sx={{ mb: 4 }}>
                  <Stepper activeStep={selectedOrder.status === 'completed' ? 2 : 1} alternativeLabel>
                    {['Order Placed', 'Payment Confirmed', 'Completed'].map((label) => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Box>

                <Grid container spacing={4}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Order Information
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Order Date</Typography>
                      <Typography variant="body1">
                        {new Date(selectedOrder.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Payment Method</Typography>
                      <Typography variant="body1">{selectedOrder.paymentMethod}</Typography>
                    </Box>
                    {selectedOrder.status === 'refunded' && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">Refund Amount</Typography>
                        <Typography variant="body1" color="error.main">
                          -${selectedOrder.refundAmount?.toFixed(2)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Refunded on {selectedOrder.refundDate && new Date(selectedOrder.refundDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                    )}
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Items
                    </Typography>
                    {selectedOrder.items.map((item, i) => (
                      <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body1">{item.name}</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {item.price === 0 ? 'Free' : `$${item.price.toFixed(2)}`}
                        </Typography>
                      </Box>
                    ))}
                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #DEE2E6' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>Total</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#E67E22' }}>
                          ${selectedOrder.total.toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions>
              {selectedOrder.status === 'completed' && (
                <Button
                  startIcon={<ReplayIcon />}
                  onClick={handleRefundRequest}
                  sx={{ mr: 'auto', color: '#DC3545' }}
                >
                  Request Refund
                </Button>
              )}
              <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
              <Button
                variant="contained"
                onClick={() => handleDownloadInvoice(selectedOrder)}
                sx={{
                  backgroundColor: '#E67E22',
                  '&:hover': { backgroundColor: '#d35400' },
                }}
              >
                Download Invoice
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Invoice Dialog */}
      <Dialog
        open={invoiceDialogOpen}
        onClose={() => setInvoiceDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Invoice</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box sx={{ p: 2 }}>
              <Box textAlign="center" mb={3}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#2C3E50' }}>
                  ChinaWise
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Invoice #{selectedOrder.id}
                </Typography>
              </Box>

              <Box mb={3}>
                <Typography variant="body2" color="text.secondary">Bill To:</Typography>
                <Typography variant="body1">Sarah Johnson</Typography>
                <Typography variant="body1">sarah@example.com</Typography>
              </Box>

              <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell align="right">Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedOrder.items.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell align="right">
                          {item.price === 0 ? 'Free' : `$${item.price.toFixed(2)}`}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        ${selectedOrder.total.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Box textAlign="center">
                <Typography variant="body2" color="text.secondary">
                  Thank you for your purchase!
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInvoiceDialogOpen(false)}>Close</Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            sx={{
              backgroundColor: '#E67E22',
              '&:hover': { backgroundColor: '#d35400' },
            }}
          >
            Download PDF
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showSuccess}
        autoHideDuration={4000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="info" onClose={() => setShowSuccess(false)}>
          Refund request submitted. We'll process it within 3-5 business days.
        </Alert>
      </Snackbar>
    </>
  );
}
