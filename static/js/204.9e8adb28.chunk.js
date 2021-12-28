(globalThis.webpackChunksen_lp=globalThis.webpackChunksen_lp||[]).push([[204],{59624:(e,s,t)=>{"use strict";t.r(s),t.d(s,{AccountProvider:()=>C,MintProvider:()=>q,PoolProvider:()=>p,UIProvider:()=>d,WalletProvider:()=>x,useAccount:()=>A,useMint:()=>Z,usePool:()=>g,useUI:()=>u,useWallet:()=>k,withAccount:()=>I,withMint:()=>D,withPool:()=>f,withUI:()=>l,withWallet:()=>v});var n=t(92950),r=t(55754),i=t(78589),o=t(45263);const a=(0,n.createContext)({}),d=({children:e,appId:s,style:t={},antd:d=!1})=>{const c=(0,r.useSelector)((e=>e.ui)),l=(0,n.useMemo)((()=>({ui:c})),[c]),u=d?{getPopupContainer:()=>document.getElementById(s),..."object"===typeof d?d:{}}:void 0;return(0,o.jsx)(a.Provider,{value:l,children:(0,o.jsx)("section",{id:s,style:{height:"100%",backgroundColor:"transparent",...t},children:u?(0,o.jsx)(i.ConfigProvider,{...u,children:e}):e})})},c=({children:e})=>(0,o.jsx)(a.Consumer,{children:s=>n.Children.map(e,(e=>(0,n.cloneElement)(e,{...s})))}),l=e=>{class s extends n.Component{render(){const{forwardedRef:s,...t}=this.props;return(0,o.jsx)(c,{children:(0,o.jsx)(e,{ref:s,...t})})}}return(0,n.forwardRef)(((e,t)=>(0,o.jsx)(s,{...e,ref:t})))},u=()=>(0,n.useContext)(a),h=(0,n.createContext)({}),p=({children:e})=>{const s=(0,r.useSelector)((e=>e.pools)),t=(0,n.useMemo)((()=>({pools:s})),[s]);return(0,o.jsx)(h.Provider,{value:t,children:e})},m=({children:e})=>(0,o.jsx)(h.Consumer,{children:s=>n.Children.map(e,(e=>(0,n.cloneElement)(e,{...s})))}),f=e=>{class s extends n.Component{render(){const{forwardedRef:s,...t}=this.props;return(0,o.jsx)(m,{children:(0,o.jsx)(e,{ref:s,...t})})}}return(0,n.forwardRef)(((e,t)=>(0,o.jsx)(s,{...e,ref:t})))},g=()=>(0,n.useContext)(h),w=(0,n.createContext)({}),x=({children:e})=>{const s=(0,r.useSelector)((e=>e.wallet)),t=(0,n.useMemo)((()=>({wallet:s})),[s]);return(0,o.jsx)(w.Provider,{value:t,children:e})},b=({children:e})=>(0,o.jsx)(w.Consumer,{children:s=>n.Children.map(e,(e=>(0,n.cloneElement)(e,{...s})))}),v=e=>{class s extends n.Component{render(){const{forwardedRef:s,...t}=this.props;return(0,o.jsx)(b,{children:(0,o.jsx)(e,{ref:s,...t})})}}return(0,n.forwardRef)(((e,t)=>(0,o.jsx)(s,{...e,ref:t})))},k=()=>(0,n.useContext)(w),y=(0,n.createContext)({}),C=({children:e})=>{const s=(0,r.useSelector)((e=>e.accounts)),t=(0,n.useMemo)((()=>({accounts:s})),[s]);return(0,o.jsx)(y.Provider,{value:t,children:e})},j=({children:e})=>(0,o.jsx)(y.Consumer,{children:s=>n.Children.map(e,(e=>(0,n.cloneElement)(e,{...s})))}),I=e=>{class s extends n.Component{render(){const{forwardedRef:s,...t}=this.props;return(0,o.jsx)(j,{children:(0,o.jsx)(e,{ref:s,...t})})}}return(0,n.forwardRef)(((e,t)=>(0,o.jsx)(s,{...e,ref:t})))},A=()=>(0,n.useContext)(y);var S=t(19289),M=t(95418);const P="mints",E=(0,S.createAsyncThunk)("mints/getMint",(async({address:e,force:s=!1},{getState:t})=>{if(!M.account.isAddress(e))throw new Error("Invalid mint address");if(!s){const{accounts:{[e]:s}}=t();if(s)return{[e]:s}}const{splt:n}=window.sentre;return{[e]:await n.getMintData(e)}})),R=(0,S.createAsyncThunk)("mints/upsetMint",(async({address:e,data:s})=>{if(!M.account.isAddress(e))throw new Error("Invalid address");if(!s)throw new Error("Data is empty");return{[e]:s}})),L=(0,S.createAsyncThunk)("mints/deleteMint",(async({address:e})=>{if(!M.account.isAddress(e))throw new Error("Invalid address");return{address:e}}));(0,S.createSlice)({name:P,initialState:{},reducers:{},extraReducers:e=>{e.addCase(E.fulfilled,((e,{payload:s})=>{Object.assign(e,s)})).addCase(R.fulfilled,((e,{payload:s})=>{Object.assign(e,s)})).addCase(L.fulfilled,((e,{payload:s})=>{delete e[s.address]}))}}).reducer;const U=new(t(16781).Z),B=(0,n.createContext)({}),q=({children:e})=>{const s=(0,r.useDispatch)(),t=(0,r.useSelector)((e=>e.mints)),i=(0,n.useCallback)((async(...e)=>await s(E(...e)).unwrap()),[s]),a=(0,n.useCallback)((async e=>{var s;if(!M.account.isAddress(e))throw new Error("Invalid mint address");const t=await U.findByAddress(e);if(null!==t&&void 0!==t&&t.decimals)return t.decimals;const n=await i({address:e});if(null!==(s=n[e])&&void 0!==s&&s.decimals)return n[e].decimals;throw new Error("Cannot find mint decimals")}),[i]),d=(0,n.useMemo)((()=>({mints:t,getMint:i,getDecimals:a,tokenProvider:U})),[t,i,a]);return(0,o.jsx)(B.Provider,{value:d,children:e})},T=({children:e})=>(0,o.jsx)(B.Consumer,{children:s=>n.Children.map(e,(e=>(0,n.cloneElement)(e,{...s})))}),D=e=>{class s extends n.Component{render(){const{forwardedRef:s,...t}=this.props;return(0,o.jsx)(T,{children:(0,o.jsx)(e,{ref:s,...t})})}}return(0,n.forwardRef)(((e,t)=>(0,o.jsx)(s,{...e,ref:t})))},Z=()=>(0,n.useContext)(B)},16781:(e,s,t)=>{"use strict";t.d(s,{Z:()=>v});var n=t(11796),r=t(67845),i=t(63805);const o={spltAddress:"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",splataAddress:"ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"},a={devnet:{...o,node:"https://api.devnet.solana.com",chainId:103,sntrAddress:"5YwUkPdXLoujGkZuo9B4LsLKj3hdkDcfP4derpspifSJ",sntrPoolAddress:"3EUPL7YQLbU6DNU5LZeQeHPXTf1MigJ2yASXA9rH5Ku4",swapAddress:"4erFSLP7oBFSVC1t35jdxmbfxEhYCKfoM6XdG2BLR3UF",taxmanAddress:"8UaZw2jDhJzv5V53569JbCd3bD4BnyCfBH3sjwgajGS9"},testnet:{...o,node:"https://api.testnet.solana.com",chainId:102,sntrAddress:"",sntrPoolAddress:"",swapAddress:"",taxmanAddress:""},mainnet:{...o,node:"https://api.mainnet-beta.solana.com",chainId:101,sntrAddress:"SENBBKVCM7homnf5RX9zqpf1GFe935hnbU4uVzY1Y6M",sntrPoolAddress:"Aa3WZX7Xunfebp2MuAcz9CNw8TYTDL7mVrmb11rjyVm6",swapAddress:"SSW7ooZ1EbEognq5GosbygA3uWW1Hq1NsFq6TsftCFV",taxmanAddress:"9doo2HZQEmh2NgfT3Yx12M89aoBheycYqH1eaR5gKb3e"}};const d="senhub",c={sen_lp:{url:"https://descartesnetwork.github.io/sen-lp/index.js",appId:"sen_lp",name:"Sen LP",author:{name:"Sentre",email:"hi@sentre.io"},supportedViews:"page,widget".split(",").map((e=>e.trim())).filter((e=>["page","widget"].includes(e))),tags:"solana,dapps,liquidity".split(",").map((e=>e.trim())),description:"Liquidity Provision to pools in the Sentre ecosystem",verified:!1}},l={development:{defaultAppId:d,extra:c,senreg:"https://descartesnetwork.github.io/senreg/register.json"},staging:{defaultAppId:d,extra:c,senreg:"https://descartesnetwork.github.io/senreg/register.json"},production:{defaultAppId:d,extra:{},senreg:"https://descartesnetwork.github.io/senreg/register.json"}},u={sol:a[i.ef],register:l[i.OB]},h=e=>({symbol:"SOL",name:"Solana",address:"11111111111111111111111111111111",decimals:9,chainId:e,extensions:{coingeckoId:"solana"},logoURI:"https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"}),p=e=>({symbol:"SNTR",name:"Sentre",address:"5YwUkPdXLoujGkZuo9B4LsLKj3hdkDcfP4derpspifSJ",decimals:9,chainId:e,extensions:{coingeckoId:"sentre"},logoURI:"https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/SENBBKVCM7homnf5RX9zqpf1GFe935hnbU4uVzY1Y6M/logo.png"}),m=[h(103),p(103),{symbol:"wBTC",name:"Wrapped Bitcoin",address:"8jk4eJymMfNZV9mkRNxJEt2VJ3pRvdJvD5FE94GXGBPM",decimals:9,chainId:103,extensions:{coingeckoId:"bitcoin"},logoURI:"https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/qfnqNqs3nCAHjnyCgLRDbBtq4p2MtHZxw8YjSyYhPoL/logo.png"},{symbol:"wETH",name:"Ethereum",address:"27hdcZv7RtuMp75vupThR3T4KLsL61t476eosMdoec4c",decimals:9,chainId:103,extensions:{coingeckoId:"ethereum"},logoURI:"https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/FeGn77dhg1KXRRFeSwwMiykZnZPw5JXW6naf2aQgZDQf/logo.png"},{symbol:"UNI",name:"Uniswap",address:"FVZFSXu3yn17YdcxLD72TFDUqkdE5xZvcW18EUpRQEbe",decimals:9,chainId:103,extensions:{coingeckoId:"uniswap"},logoURI:"https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/3MVa4e32PaKmPxYUQ6n8vFkWtCma68Ld7e7fTktWDueQ/logo.png"},{symbol:"USDC",name:"USD Coin",address:"2z6Ci38Cx6PyL3tFrT95vbEeB3izqpoLdxxBkJk2euyj",decimals:9,chainId:103,extensions:{coingeckoId:"usd-coin"},logoURI:"https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png"}],{sol:{chainId:f,sntrAddress:g}}=u,w=/[\W_]+/g,x={tokenize:"full",context:!0,minlength:3},b={document:{id:"address",index:[{field:"symbol",...x},{field:"name",...x}]}};const v=class{constructor(){this.tokenMap=void 0,this.engine=void 0,this.chainId=void 0,this.cluster=void 0,this.loading=void 0,this.queue=void 0,this._init=async()=>this.tokenMap.size?[this.tokenMap,this.engine]:new Promise((async e=>{if(this.loading)return this.queue.push(e);this.loading=!0;let s=await(await(new r.DK).resolve()).filterByChainId(this.chainId).getList();for(s.forEach(((e,t)=>{if(e.address===g){const{extensions:n,name:r,symbol:i,...o}=e;s[t]={...o,name:"Sentre",symbol:"SNTR",extensions:{...n,coingeckoId:"sentre"}}}})),"devnet"===this.cluster&&(s=s.concat(m)),s="testnet"===this.cluster?s.concat([p(102),h(102)]):s.concat([h(101)]),s.forEach((e=>this.tokenMap.set(e.address,e))),this.engine=new n.Document(b),this.tokenMap.forEach((({address:e,...s})=>this.engine.add(e,s))),e([this.tokenMap,this.engine]);this.queue.length;)this.queue.shift()([this.tokenMap,this.engine]);this.loading=!1})),this.all=async()=>{const[e]=await this._init();return Array.from(e.values())},this.findByAddress=async e=>{const[s]=await this._init();return s.get(e)},this.find=async(e,s)=>{const[t,n]=await this._init();let r=[];return e.split(w).forEach((e=>n.search(e,s).forEach((({result:e})=>e.forEach((e=>{if(r.findIndex((({address:s})=>s===e))<0){const s=t.get(e);s&&r.push(s)}})))))),r},this.tokenMap=new Map,this.engine=void 0,this.chainId=f,this.cluster=i.ef,this.loading=!1,this.queue=[],this._init()}}},63805:(e,s,t)=>{"use strict";t.d(s,{OB:()=>r,ef:()=>i});var n=t(53933);const r="production",i=(()=>{switch(n.Z.get("network")){case"devnet":return"devnet";case"testnet":return"testnet";default:return"mainnet"}})()},53933:(e,s,t)=>{"use strict";t.d(s,{Z:()=>a});const n="sentre",r=window.localStorage,i=e=>{if(!e)return null;try{return JSON.parse(e)}catch(s){return null}},o={set:(e,s)=>{let t=i(r.getItem(n));t&&"object"===typeof t||(t={}),t[e]=s,r.setItem(n,JSON.stringify(t))},get:e=>{let s=i(r.getItem(n));return s&&"object"===typeof s?s[e]:null},clear:e=>{o.set(e,null)}},a=o},46601:()=>{},89214:()=>{},85568:()=>{},52361:()=>{},94616:()=>{},55024:()=>{}}]);
//# sourceMappingURL=204.9e8adb28.chunk.js.map