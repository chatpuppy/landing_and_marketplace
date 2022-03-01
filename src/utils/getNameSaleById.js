export const getNameSaleById = (id) => {
      switch(id) {
        case 1: return 'Private Sale';
        case 2: return 'Public sale';
        case 3: return 'Team';
        case 4: return 'Advisor';
        case 7: return 'Marketing';
        default: { 
          break;
       } 
      }
    }