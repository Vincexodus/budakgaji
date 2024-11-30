'use client';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import PageContainer from '@/components/layout/page-container';

export default function Page() {
  const [formData, setFormData] = useState({
    // Scam Details
    scamDate: '2024-11-30',
    scamType: 'online-shopping',
    communicationMethod: 'email',

    // Scammer Details
    contactPhone: '0123456789',
    contactEmail: 'scammer@example.com',
    socialMediaAccount: '@scammer',
    bankAccountNumber: '1234567890',
    bankName: 'ABC Bank',
    suspiciousLinks: 'http://suspicious-link.com',

    // Transaction Information
    moneyLost: '5000',
    paymentMode: 'credit-card',
    transactionId: 'TX123456789',

    // Personal Details
    reporterName: 'John Doe',
    reporterPhone: '0987654321',
    reporterEmail: 'reporter@example.com',
    identificationNumber: '901234567890',

    // Supporting Evidence
    policeReport: null,
    transactionProof: null,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: { target: { name: any; value: any; type: any; files: any; }; }) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // In a real application, you would send this data to a backend
    console.log('Scam Report Submitted:', formData);
    setSubmitted(true);
  };

  return (
    <PageContainer scrollable>
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center text-red-600">
        Scam Reporting Portal
      </h1>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Scam Details Section */}

          {/* Scammer Details Section */}
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-600">2. Scammer Details</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-400">Contact Phone Number</Label>
                <Input className="text-gray-500"
                  type="tel" 
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label className="text-gray-400">Contact Email</Label>
                <Input className="text-gray-500"
                  type="email" 
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label className="text-gray-400">Social Media Account</Label>
                <Input className="text-gray-500"
                  type="text" 
                  name="socialMediaAccount"
                  value={formData.socialMediaAccount}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label className="text-gray-400">Bank Account Number</Label>
                <Input className="text-gray-500"
                  type="text" 
                  name="bankAccountNumber"
                  value={formData.bankAccountNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label className="text-gray-400">Bank Name</Label>
                <Input className="text-gray-500"
                  type="text" 
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label className="text-gray-400">Suspicious Links/Websites</Label>
                <Input className="text-gray-500"
                  type="text" 
                  name="suspiciousLinks"
                  value={formData.suspiciousLinks}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Transaction Information Section */}
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-600">3. Transaction Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-400">Amount Lost</Label>
                <Input className="text-gray-500"
                  type="number" 
                  name="moneyLost"
                  value={formData.moneyLost}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label className="text-gray-400">Payment Mode</Label>
                <Select 
                  name="paymentMode"
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev, 
                    paymentMode: value
                  }))}
                >
                  <SelectTrigger className="text-gray-500">
                    <SelectValue className="text-gray-300" placeholder="Select Payment Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                    <SelectItem value="credit-card">Credit Card</SelectItem>
                    <SelectItem value="e-wallet">E-Wallet</SelectItem>
                    <SelectItem value="cryptocurrency">Cryptocurrency</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-400">Transaction ID</Label>
                <Input className="text-gray-500"
                  type="text" 
                  name="transactionId"
                  value={formData.transactionId}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Personal Details Section */}
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-600">4. Personal Details</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-400">Full Name</Label>
                <Input className="text-gray-500"
                  type="text" 
                  name="reporterName"
                  value={formData.reporterName}
                  onChange={handleInputChange}
                  required
                />
              </div> 
              <div>
                <Label className="text-gray-400">Phone Number</Label>
                <Input className="text-gray-500"
                  type="tel" 
                  name="reporterPhone"
                  value={formData.reporterPhone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label className="text-gray-400">Email Address</Label>
                <Input className="text-gray-500"
                  type="email" 
                  name="reporterEmail"
                  value={formData.reporterEmail}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label className="text-gray-400">ID Number (MyKad/Passport)</Label>
                <Input className="text-gray-500"
                  type="text" 
                  name="identificationNumber"
                  value={formData.identificationNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Supporting Evidence Section */}
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-600">5. Supporting Evidence</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-400">Police Report</Label>
                <Input className="text-gray-500"
                  type="file" 
                  name="policeReport"
                  onChange={handleInputChange}
                  multiple
                />
              </div>
              <div>
                <Label className="text-gray-400">Transaction Proof (If Applicable)</Label>
                <Input className="text-gray-500"
                  type="file" 
                  name="transactionProof"
                  onChange={handleInputChange}
                  multiple
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  type="submit" 
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Submit Scam Report
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Submission</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to submit this scam report? 
                    Please ensure all information is accurate.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSubmit}>
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </form>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            Report Submitted Successfully
          </h2>
          <p className="mb-4 text-gray-600">
            Thank you for reporting this scam. Authorities will review your report.
          </p>
          <Button 
            onClick={() => setSubmitted(false)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Submit Another Report
          </Button>
        </div>
      )}
    </div>
    </PageContainer>
  );
};
