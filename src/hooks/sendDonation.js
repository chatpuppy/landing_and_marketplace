import { TOKEN_VESTING_ADDRESS } from "constants";
  
  const sendDonation = async(participantID, amount) => {
        
      if((!window.ethereum) || (!currentAccount)){
          if (!toast.isActive(id)) {
            toast({
              id,
              title: 'No wallet found',
              description: "Please install Metamask",
              status: 'error',
              duration: 4000,
              isClosable: true,
            })
          }
          return;
        }

      if(currentNetwork!==42) {
      if (!toast.isActive(id)) {
          toast({
          id,
          title: 'Wrong network',
          description: "Please change network to Kovan Testnet",
          status: 'error',
          duration: 4000,
          isClosable: true,
          })
      }
      return;
      }
      setIsLoading(true);

      try {
        const { ethereum } = window; //injected by metamask
        const provider = new ethers.providers.Web3Provider(ethereum); 
        const signer = provider.getSigner(); 

        const participant = participantID;
        const TokenVestingContract = new ethers.Contract(TOKEN_VESTING_ADDRESS, donateABI, signer);


        async function donateAction(){
          const response = await TokenVestingContract.crowdFunding(participant)
          setDonationTX(response)
        }


        async function priceForAmount(){
          const response = await TokenVestingContract.getPriceForAmount(participant, amount)
          setPriceForAmount(response)
        }
        
        priceForAmount()
        donateAction()
        
      } catch(err) {
       console.log('Donation Fail')
      }
  }