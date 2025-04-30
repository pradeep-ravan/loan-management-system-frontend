export const calculateEMI = (loanAmount, interestRate, tenureMonths) => {
    const monthlyRate = interestRate / 12 / 100;
    
    const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths) / 
                (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    
    return Math.round(emi * 100) / 100; 
  };
  
  export const generateAmortizationSchedule = (loanAmount, interestRate, tenureMonths, repaymentDates, disbursementDate) => {
    const monthlyRate = interestRate / 12 / 100;
    const emi = calculateEMI(loanAmount, interestRate, tenureMonths);
    
    let remainingPrincipal = loanAmount;
    const schedule = [];
    
    const sortedDates = [...repaymentDates].sort((a, b) => new Date(a) - new Date(b));
    
    if (sortedDates.length === 1) {
      const startDate = new Date(sortedDates[0]);
      
      for (let i = 0; i < tenureMonths; i++) {
        const paymentDate = new Date(startDate);
        paymentDate.setMonth(startDate.getMonth() + i);
        
        const interestPayment = remainingPrincipal * monthlyRate;
        const principalPayment = emi - interestPayment;
        remainingPrincipal -= principalPayment;
        
        schedule.push({
          paymentNumber: i + 1,
          paymentDate: paymentDate.toISOString().split('T')[0],
          emi: emi,
          principalPayment: Math.round(principalPayment * 100) / 100,
          interestPayment: Math.round(interestPayment * 100) / 100,
          remainingPrincipal: Math.max(0, Math.round(remainingPrincipal * 100) / 100),
        });
      }
    } else {
      let installmentNumber = 1;
      
      const disbursement = new Date(disbursementDate);
      const finalRepayment = new Date(sortedDates[sortedDates.length - 1]);
      
      for (let date of sortedDates) {
        const paymentDate = new Date(date);
        
        // Calculate interest for this period
        const interestPayment = remainingPrincipal * monthlyRate;
        const principalPayment = emi - interestPayment;
        remainingPrincipal -= principalPayment;
        
        schedule.push({
          paymentNumber: installmentNumber++,
          paymentDate: paymentDate.toISOString().split('T')[0],
          emi: emi,
          principalPayment: Math.round(principalPayment * 100) / 100,
          interestPayment: Math.round(interestPayment * 100) / 100,
          remainingPrincipal: Math.max(0, Math.round(remainingPrincipal * 100) / 100),
        });
      }
    }
    
    return schedule;
  };
  
  export const convertScheduleToCSV = (schedule) => {
    const headers = [
      'Payment Number',
      'Payment Date',
      'EMI Amount',
      'Principal Component',
      'Interest Component',
      'Remaining Principal'
    ];
    
    const csvRows = [
      headers.join(',')
    ];
    
    for (const row of schedule) {
      const values = [
        row.paymentNumber,
        row.paymentDate,
        row.emi,
        row.principalPayment,
        row.interestPayment,
        row.remainingPrincipal
      ];
      
      csvRows.push(values.join(','));
    }
    
    return csvRows.join('\n');
  };
  
  export const getNextEMIDate = (schedule) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (const payment of schedule) {
      const paymentDate = new Date(payment.paymentDate);
      if (paymentDate >= today) {
        return payment;
      }
    }
    
    return null; 
  };