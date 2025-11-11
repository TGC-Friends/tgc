import { useState } from 'react';
import { FormData as FormDataType, ATTENDANTS } from '../types';
import { 
  submitFormDetails, 
  processCustomerAccount, 
  processOrders, 
  retrieveFormDetails,
  updateCustomerInGS,
  updateOrderInGS,
  updateInvoiceInGS,
  updateFittingDatesInGS
} from '../api';
import PersonalInfoSection from './PersonalInfoSection';
import EventDetailsSection from './EventDetailsSection';
import GownPreferencesSection from './GownPreferencesSection';
import OfficialUseSection from './OfficialUseSection';
import StatusCards from './StatusCards';
import ManualUpdateCards from './ManualUpdateCards';
import RetrieveSection from './RetrieveSection';
import logoBlack from '../assets/images/logoBlack.png';

const initialFormData: FormDataType = {
  bridename: '',
  groomname: '',
  phonenum: '',
  emailfield: '',
  howdidyouhear: '',
  eventdate1: '',
  eventtype1: 'None',
  eventvenue1: '',
  eventdate2: '',
  eventtype2: 'None',
  eventvenue2: '',
  eventdate3: '',
  eventtype3: 'None',
  eventvenue3: '',
  requiredoutfit: [],
  noofgowns: '',
  preferredoutfit: [],
  preferredoutOthers: '',
  preferredstyle: [],
  preferredstyleOthers: '',
  preferredNeckline: [],
  preferredNeckOthers: '',
  attendant: ATTENDANTS[0],
  additionalnotes: '',
};

function Form() {
  const [formData, setFormData] = useState<FormDataType>(initialFormData);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [accountMessage, setAccountMessage] = useState<string>('');
  const [orderMessage, setOrderMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = <K extends keyof FormDataType>(
    field: K,
    value: FormDataType[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setStatusMessage('Checking records for registered values...');
    setAccountMessage('Checking Booqable for registered acct...');
    setOrderMessage('Checking for existing orders...');

    try {
      // Submit form details
      const tabletFormResponse = await submitFormDetails(formData);
      setStatusMessage(tabletFormResponse.tabletform_msg || 'Form submitted');

      // Process customer account
      const customerResponse = await processCustomerAccount(formData);
      setAccountMessage(customerResponse.custform_msg || 'Customer processed');

      // If customer ID is available, process orders
      if (customerResponse.availcustID) {
        const orderData = { ...formData, cust_id: customerResponse.availcustID };
        const orderResponse = await processOrders(orderData);
        setOrderMessage(orderResponse.orders_msg || 'Order processed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatusMessage('Error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetrieve = async (email: string, phone: string) => {
    try {
      const response = await retrieveFormDetails(email, phone);
      if ('error' in response) {
        setStatusMessage(response.error);
      } else {
        // Convert string arrays back to arrays
        // The API returns data where arrays might be comma-separated strings
        const formData = response as any; // API may return strings for arrays
        const processedData: FormDataType = {
          ...formData,
          requiredoutfit: (() => {
            const value = formData.requiredoutfit;
            if (typeof value === 'string') {
              return value.split(',').filter(Boolean);
            }
            return Array.isArray(value) ? value : [];
          })(),
          preferredoutfit: (() => {
            const value = formData.preferredoutfit;
            if (typeof value === 'string') {
              return value.split(',').filter(Boolean);
            }
            return Array.isArray(value) ? value : [];
          })(),
          preferredstyle: (() => {
            const value = formData.preferredstyle;
            if (typeof value === 'string') {
              return value.split(',').filter(Boolean);
            }
            return Array.isArray(value) ? value : [];
          })(),
          preferredNeckline: (() => {
            const value = formData.preferredNeckline;
            if (typeof value === 'string') {
              return value.split(',').filter(Boolean);
            }
            return Array.isArray(value) ? value : [];
          })(),
        };
        setFormData(processedData);
        setStatusMessage('Record Retrieved. See Above.');
      }
    } catch (error) {
      console.error('Error retrieving form:', error);
      setStatusMessage('Error retrieving form. Please try again.');
    }
  };

  const handleUpdateCustomer = async (customerNum: string) => {
    try {
      const response = await updateCustomerInGS(customerNum);
      return response.customer_msg || 'Customer updated';
    } catch (error) {
      console.error('Error updating customer:', error);
      return 'Error updating customer';
    }
  };

  const handleUpdateOrder = async (orderNum: string, orderId: string) => {
    try {
      const response = await updateOrderInGS(orderNum, orderId);
      return response.orders_msg || 'Order updated';
    } catch (error) {
      console.error('Error updating order:', error);
      return 'Error updating order';
    }
  };

  const handleUpdateInvoice = async (invoiceNum: string) => {
    try {
      const response = await updateInvoiceInGS(invoiceNum);
      return response.invoice_msg || 'Invoice updated';
    } catch (error) {
      console.error('Error updating invoice:', error);
      return 'Error updating invoice';
    }
  };

  const handleUpdateFittingDates = async () => {
    try {
      const response = await updateFittingDatesInGS();
      return response.fittingdates_msg || 'Fitting dates updated';
    } catch (error) {
      console.error('Error updating fitting dates:', error);
      return 'Error updating fitting dates';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Logo */}
      <div className="flex justify-center my-3">
        <div className="w-1/2">
          <img src={logoBlack} alt="The Gown Connoisseur" className="w-full" />
        </div>
      </div>

      <div className="flex justify-center my-3">
        <div className="w-full max-w-6xl">
          <form id="formdetaillog">
            {/* Description */}
            <p className="mb-4">
              Hello! We would like to find out more about your preferences to ensure that you have a wonderful and fulfilling experience with us. This checklist will help to frame an idea of the dream gown that you are looking for. Sit back, relax and enjoy while you take time to ponder on your dream gown!
            </p>

            {/* Main Form */}
            <div className="border-2 border-gray-800">
              {/* Personal Information */}
              <PersonalInfoSection formData={formData} updateField={updateField} />

              {/* Event Details */}
              <EventDetailsSection formData={formData} updateField={updateField} />

              {/* Gown Preferences */}
              <GownPreferencesSection formData={formData} updateField={updateField} />
            </div>

            {/* Official Use Section */}
            <OfficialUseSection formData={formData} updateField={updateField} />

            {/* Submit Button */}
            <hr className="my-5" />
            <div className="flex items-center px-3">
              <div id="statusdiv" className="flex">
                <div className="mr-3">Form Table Status:</div>
                {statusMessage && <span>{statusMessage}</span>}
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn btn-outline-danger ml-auto px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Form Details'}
              </button>
            </div>

            <hr className="my-3" />

            {/* Status Cards */}
            <StatusCards
              accountMessage={accountMessage}
              orderMessage={orderMessage}
            />

            {/* Manual Update Cards */}
            <ManualUpdateCards
              onUpdateCustomer={handleUpdateCustomer}
              onUpdateOrder={handleUpdateOrder}
              onUpdateInvoice={handleUpdateInvoice}
              onUpdateFittingDates={handleUpdateFittingDates}
            />

            <hr />

            {/* Retrieve Section */}
            <RetrieveSection onRetrieve={handleRetrieve} />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Form;

