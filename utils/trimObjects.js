exports.trimUserPortfolio = (userPortfolio) => {
  return {
    _id: userPortfolio._id,
    email: userPortfolio.email,
    userName: userPortfolio.userName,
    firstName: userPortfolio.firstName,
    lastName: userPortfolio.lastName,
    phoneNumber: userPortfolio.phoneNumber,
    loanApplications: userPortfolio.loanApplications.map((loan) => ({
      _id: loan._id,
      reason: loan.reason,
      personalID: loan.personalID,
      landlordOrAgent: {
        name: loan.landlordOrAgent.name,
        address: loan.landlordOrAgent.address,
        phoneNumber: loan.landlordOrAgent.phoneNumber,
        propertyType: loan.landlordOrAgent.propertyType,
      },
      spaceRent: {
        _id: loan.spaceRent._id,
        rentName: loan.spaceRent.rentName,
        current_payment: loan.spaceRent.current_payment,
        amount: loan.spaceRent.amount,
        payment_status: loan.spaceRent.payment_status,
        interval: loan.spaceRent.interval,
        next_date: loan.spaceRent.next_date,
        due_date: loan.spaceRent.due_date,
      },
      occupation: loan.occupation,
      status: loan.status,
      createdAt: loan.createdAt,
    })),
  };
};
