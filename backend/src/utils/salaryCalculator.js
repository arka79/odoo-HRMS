const db = require('../config/db');

exports.calculatePayroll = (structure, payableDays, totalWorkingDays) => {
  const {
    monthly_wage,
    basic_pct,
    hra_pct_of_basic,
    standard_allowance_pct_of_basic,
    lta_pct_of_basic,
    employee_pf_pct,
    employer_pf_pct,
    professional_tax
  } = structure;

  const basic = monthly_wage * (basic_pct / 100);
  const hra = basic * (hra_pct_of_basic / 100);
  const standard_allowance = basic * (standard_allowance_pct_of_basic / 100);
  const lta = basic * (lta_pct_of_basic / 100);
  const fixed_allowance = monthly_wage - (basic + hra + standard_allowance + lta);
  const employee_pf = basic * (employee_pf_pct / 100);
  const employer_pf = basic * (employer_pf_pct / 100);
  const net_pay = monthly_wage - employee_pf - professional_tax;

  const net_pay_for_period = net_pay * (payableDays / totalWorkingDays);

  return {
    basic, hra, standard_allowance, lta, fixed_allowance, 
    employee_pf, employer_pf, net_pay, net_pay_for_period
  };
};
