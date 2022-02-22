import donateABI from "abi/TokensVesting_abi"
import { useContract } from '@web3-ui/hooks';

export default function DepositContract() {
    const [depositContract, isReady] = useContract(      
        '0x', // @ TokenVesting contract address
        donateABI
    );

    const [total, setTotal] = useState(0)
    const [releasable, setReleasable] = useState(0)
    const [price, setPrice] = useState(0)


    async function total() {
        const response = await depositContract?.total();
        console.log('total', response);
        setTotal(response)
      }
    
    async function releasable() {
        const response = await depositContract?.releasable();
        console.log('releasable', response);
        setReleasable(response);
    }

    async function getPriceForAmount() {
        const response = await depositContract?.getPriceForAmount();
        console.log('Price', response);
        setPrice(response);
    }

    return {
        
    }

}