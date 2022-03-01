export const getNameSaleById = (id) => {
      switch(id) {
        case 1: {
          return 'Private Sale';
        }
        case 2: {
          return 'Public sale';
        }
        default: { 
          break;
       } 
      }
    }