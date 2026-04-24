// src/App.jsx
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './auth/Login';
import OtpVerification from './auth/OtpVerification';
import Signup from './auth/Signup';
import VerifiedSuccess from './auth/VerifiedSuccess';
import RouteGuard from './components/RouteGuard';
import { CartProvider } from './context/CartContext';
import Layout from './layout/Layout'; // This is your AGRICULTURE website layout
import About from './pages/about/About';
import Cart from './pages/Cart/Cart';
import CheckOut from './pages/Cart/Checkout';
import ContactUs from './pages/ContactUs';
import MainPage from './pages/HomePages/MainPage';
import OrderPlaced from './pages/Cart/OrderPlaced';
import Services from './pages/service/Services';
import Details from './pages/shop/Details/Details';
import Shop from './pages/shop/shop';
import PrivacyPolicy from './pages/TermsAndConditions/PrivacyPolicy';
import RefundPolicy from './pages/TermsAndConditions/RefundPolicy';
import TermsAndConditions from './pages/TermsAndConditions/TermsAndConditions';

// Import your AGENT DASHBOARD layout and pages
import AgentLayout from './AgentDashboard/AgentLayout/AgentLayout'; // Agent Dashboard layout
import AgentCart from "./AgentDashboard/pages/BuyFromFarmers/AgentCart";
import AgentItemDetails from "./AgentDashboard/pages/BuyFromFarmers/AgentItemDetails";
import BuyFromFarmers from './AgentDashboard/pages/BuyFromFarmers/BuyFromFarmers';
import AgentWishlist from './AgentDashboard/pages/Wishlist/AgentWishlist';
import AgentCheckout from './AgentDashboard/pages/Checkout/AgentCheckout';
import AgentOrderPlaced from './AgentDashboard/pages/Checkout/AgentOrderPlaced';
import Dashboard from './AgentDashboard/pages/Dashboard/Dashboard';
import PlaceOrders from './AgentDashboard/pages/PlaceOrders/PlaceOrders';
import Reports from './AgentDashboard/pages/Reports/Reports';
import Settlements from './AgentDashboard/pages/Settlements/Settlements';
import VendorPayments from './AgentDashboard/pages/VendorPayments/VendorPayments';

// Import your ADMIN DASHBOARD layout and pages
import AdminLayout from './AdminDashboard/AdminLayout/AdminLayout';
import AdminDashboard from './AdminDashboard/pages/Dashboard/Dashboard';
import UserServiceSettings from './AdminDashboard/pages/UserManagement/UserServiceSettings';
import AdminReports from './AdminDashboard/pages/Reports/Reports';
import HoldTransactions from './AdminDashboard/pages/Reports/HoldTransactions';
import CreateUser from './AdminDashboard/pages/UserManagement/CreateUser';
import CreateAgent from './AdminDashboard/pages/AgentManagement/CreateAgent';
import AgentKycVerification from './AdminDashboard/pages/Dashboard/AdminActions/AgentKycVerification';
import AgentOnboarded from './AdminDashboard/pages/Dashboard/AdminActions/AgentOnboarded';
import CreateEmployee from './AdminDashboard/pages/EmployeeManagement/CreateEmployee';
import EmployeesList from './AdminDashboard/pages/EmployeeManagement/EmployeesList';
import AddChargeConfiguration from './AdminDashboard/pages/Integrations/AddChargeConfiguration';
import PaymentGatewaySetup from './AdminDashboard/pages/Integrations/PaymentGatewaySetup';
import AddPaymentGateway from './AdminDashboard/pages/Integrations/AddPaymentGateway';
import AgentOtpVerification from './AdminDashboard/pages/OtpVerification';
import RolesManagement from './AdminDashboard/pages/AdminSettings/RolesManagement';
import PlansManagement from './AdminDashboard/pages/AdminSettings/PlansManagement';
import PlanCommissionManager from './AdminDashboard/pages/AdminSettings/PlanCommissionManager';
import ScrollTextManager from './AdminDashboard/pages/AdminSettings/ScrollTextManager';
import NoticeBoardManager from './AdminDashboard/pages/AdminSettings/NoticeBoardManager';
import PayoutChargesManager from './AdminDashboard/pages/AdminSettings/PayoutChargesManager';
import AgentProducts from './AdminDashboard/pages/Product/AgentProducts';
import WalletManagement from './AdminDashboard/pages/WalletManagement/WalletManagement';
import PaymentMethodsManager from './AdminDashboard/pages/AdminSettings/PaymentMethodsManager';
import SetBalanceRequirement from './AdminDashboard/pages/AdminSettings/SetBalanceRequirement';
import UsersList from './AdminDashboard/pages/UserManagement/UsersList';
import HoldFunds from './AdminDashboard/pages/UserManagement/HoldFunds';
import AddWallet from './AdminDashboard/pages/UserManagement/AddWallet';
import AgentsList from './AdminDashboard/pages/AgentManagement/AgentsList';
import ConfirmWalletCredit from './AdminDashboard/pages/ConfirmWalletCredit';
import AdminPrivacyPolicy from './AdminDashboard/pages/WebsiteSettings/PrivacyPolicy';
import AdminTermsAndConditions from './AdminDashboard/pages/WebsiteSettings/TermsAndConditions';
import AdminRefundPolicy from './AdminDashboard/pages/WebsiteSettings/RefundPolicy';
import PurchaseInvoice from './AgentDashboard/pages/PurchaseInvoice';
import SalesInvoice from './AgentDashboard/pages/SalesInvoice';
import PaymentInvoice from './AgentDashboard/pages/PaymentInvoice';
import AddProducts from './AgentDashboard/pages/Products/AddProducts';
import AddProductCategory from './AgentDashboard/pages/Products/AddProductCategory';
import WalletRequest from './AgentDashboard/pages/WalletRequest';
import PlanCommissionConfiguration from './AdminDashboard/pages/AdminSettings/PlanComissionConfiguration';
import Partners from './pages/partners/Partners';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <CartProvider>
        <RouteGuard>
          <ScrollToTop />
          <Routes>
          {/* Public/auth routes without any Layout (no navbar) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* <Route path="/otp-verification" element={<OtpVerification />} />
          <Route path="/verified-success" element={<VerifiedSuccess />} /> */}
          {/* AGRICULTURE WEBSITE routes wrapped with Layout (agriculture navbar) */}
          <Route element={<Layout />}>
            <Route path="/" element={<MainPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/details/:id" element={<Details />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/cart/checkout" element={<CheckOut />} />
            <Route path="/order-placed" element={<OrderPlaced />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
          </Route>

          {/* AGENT DASHBOARD routes wrapped with AgentLayout (agent navbar + sidebar) */}
          <Route path="/agent" element={<AgentLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="buy-from-farmers" element={<BuyFromFarmers />} />
            <Route path="agent-item-details/:id" element={<AgentItemDetails />} />
            <Route path="cart" element={<AgentCart />} />
            <Route path="wishlist" element={<AgentWishlist />} />
            <Route path="checkout" element={<AgentCheckout />} />
            <Route path="order-placed" element={<AgentOrderPlaced />} />
            <Route path="place-orders" element={<PlaceOrders />} />
            <Route path="vendor-payments" element={<VendorPayments />} />
            <Route path="settlements" element={<Settlements />} />
            <Route path="reports" element={<Reports />} />
            <Route path="purchase-invoice" element={<PurchaseInvoice />} />
            <Route path="sales-invoice" element={<SalesInvoice />} />
            <Route path="payment-invoice" element={<PaymentInvoice />} />
            <Route path="wallet-request" element={<WalletRequest />} />
            <Route path="products/add-category" element={<AddProductCategory />} />
            <Route path="products/add-product" element={<AddProducts />} />

            <Route path="place-orders" element={<PlaceOrders />} />
            <Route path="vendor-payments" element={<VendorPayments />} />
            <Route path="settlements" element={<Settlements />} />
            <Route path="reports" element={<Reports />} />
          </Route>
          {/* ADMIN DASHBOARD routes wrapped with AdminLayout */}
            <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AgentProducts />} />
            <Route path="reports/hold-transactions" element={<HoldTransactions />} />
            <Route path="reports/transaction-reports" element={<AdminReports />} />
            <Route path="user-service-settings" element={<UserServiceSettings />} />
            <Route path="reports" element={<AdminReports />} />

            <Route path="agent-kyc-verification" element={<AgentKycVerification />} />
            <Route path="agent-onboarded" element={<AgentOnboarded />} />
            <Route path="employee-management/add-employee" element={<CreateEmployee />} />
            <Route path="employee-management/employees-list" element={<EmployeesList />} />
            <Route path="create-employee" element={<Navigate to="/admin/employee-management/add-employee" replace />} />

            <Route path="integration/add-payment-gateway" element={<AddPaymentGateway />} />
            <Route path="integration/payment-gateway-setup" element={<PaymentGatewaySetup />} />
            <Route path="integration/charge" element={<AddChargeConfiguration />} />
            <Route path="admin-settings/roles-management" element={<RolesManagement />} />
            <Route path="admin-settings/plans-management" element={<PlansManagement />} />
            <Route path="admin-settings/plan-commission-manager" element={<PlanCommissionManager />} />
            <Route path="admin-settings/plan-commission-configuration" element={<PlanCommissionConfiguration />} />
            <Route path="admin-settings/scroll-text-manager" element={<ScrollTextManager />} />
            <Route path="admin-settings/notice-board-manager" element={<NoticeBoardManager />} />
            <Route path="admin-settings/payout-charges-manager" element={<PayoutChargesManager />} />
            <Route path="admin-settings/set-balance-requirement" element={<SetBalanceRequirement />} />
            <Route path="admin-settings/payment-methods-manager" element={<PaymentMethodsManager />} />
            <Route path="user-management/user-service-settings" element={<UserServiceSettings />} />
            <Route path="user-management/create-user" element={<CreateUser />} />
            <Route path="user-management/users-list" element={<UsersList />} />
            <Route path="user-management/add-wallet" element={<AddWallet />} />
            <Route path="user-management/hold-funds" element={<HoldFunds />} />
            <Route path="agent-management/add-agent" element={<CreateAgent />} />
            <Route path="agent-management/agents-list" element={<AgentsList />} />
            <Route path="wallet-management" element={<WalletManagement />} />
            <Route path="website-settings/privacy-policy" element={<AdminPrivacyPolicy />} />
            <Route path="website-settings/terms-conditions" element={<AdminTermsAndConditions />} />
            <Route path="website-settings/refund-policy" element={<AdminRefundPolicy />} />

            <Route path="hold-transactions" element={<HoldTransactions />} />
            <Route path="add-charge-configuration" element={<AddChargeConfiguration />} />
            <Route path="payment-gateway-setup" element={<PaymentGatewaySetup />} />
            <Route path="add-payment-gateway" element={<AddPaymentGateway />} />
            <Route path="agent-otp-verification" element={<AgentOtpVerification />} />
            <Route path="roles-management" element={<RolesManagement />} />
            <Route path="plans-management" element={<PlansManagement />} />
            <Route path="plan-comission-manager" element={<PlanCommissionManager />} />
            <Route path="scroll-text-manager" element={<ScrollTextManager />} />
            <Route path="notice-board-manager" element={<NoticeBoardManager />} />
            <Route path="payout-charges-manager" element={<PayoutChargesManager />} />
            <Route path="terms-conditions" element={<TermsAndConditions />} />
            <Route path="refund-policy" element={<RefundPolicy />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="agent-products" element={<AgentProducts />} />
            <Route path="wallet-management" element={<WalletManagement />} />
            <Route path="payment-methods-manager" element={<PaymentMethodsManager />} />
            <Route path="set-balance-requirement" element={<SetBalanceRequirement />} />
            <Route path="users-list" element={<UsersList />} />
            <Route path="hold-funds" element={<HoldFunds />} />
            <Route path="add-wallet" element={<AddWallet />} />
            <Route path="confirm-wallet-credit" element={<ConfirmWalletCredit />} />
          </Route>


           {/* SUPER DISTRIBUTOR routes */}
          <Route path="/super-distributor" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="agent-management/add-agent" element={<CreateAgent />} />
            <Route path="agent-management/agents-list" element={<AgentsList />} />
            <Route path="user-management/create-user" element={<CreateUser />} />
            <Route path="user-management/users-list" element={<UsersList />} />
            <Route path="user-management/user-service-settings" element={<UserServiceSettings />} />
            <Route path="user-management/add-wallet" element={<AddWallet />} />
            <Route path="user-management/hold-funds" element={<HoldFunds />} />
            <Route path="reports/hold-transactions" element={<HoldTransactions />} />
            <Route path="reports/transaction-reports" element={<AdminReports />} />
            <Route path="reports" element={<AdminReports />} />
          </Route>

          {/* MASTER DISTRIBUTOR routes */}
          <Route path="/master-distributor" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="agent-management/add-agent" element={<CreateAgent />} />
            <Route path="agent-management/agents-list" element={<AgentsList />} />
            <Route path="user-management/create-user" element={<CreateUser />} />
            <Route path="user-management/users-list" element={<UsersList />} />
            <Route path="user-management/user-service-settings" element={<UserServiceSettings />} />
            <Route path="user-management/add-wallet" element={<AddWallet />} />
            <Route path="user-management/hold-funds" element={<HoldFunds />} />
            <Route path="reports/hold-transactions" element={<HoldTransactions />} />
            <Route path="reports/transaction-reports" element={<AdminReports />} />
            <Route path="reports" element={<AdminReports />} />
          </Route>

          {/* DISTRIBUTOR routes */}
          <Route path="/distributor" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="agent-management/add-agent" element={<CreateAgent />} />
            <Route path="agent-management/agents-list" element={<AgentsList />} />
            <Route path="user-management/create-user" element={<CreateUser />} />
            <Route path="user-management/users-list" element={<UsersList />} />
            <Route path="user-management/user-service-settings" element={<UserServiceSettings />} />
            <Route path="user-management/add-wallet" element={<AddWallet />} />
            <Route path="user-management/hold-funds" element={<HoldFunds />} />
            <Route path="reports/hold-transactions" element={<HoldTransactions />} />
            <Route path="reports/transaction-reports" element={<AdminReports />} />
            <Route path="reports" element={<AdminReports />} />
          </Route>


          </Routes>
        </RouteGuard>
        
        {/* Toast Container for notifications */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </CartProvider>
    </Router>
  );
}

export default App;