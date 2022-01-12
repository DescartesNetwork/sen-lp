(globalThis.webpackChunksen_lp=globalThis.webpackChunksen_lp||[]).push([[204],{59624:(e,t,s)=>{"use strict";s.r(t),s.d(t,{AccountProvider:()=>y,MintProvider:()=>q,PoolProvider:()=>p,UIProvider:()=>d,WalletProvider:()=>x,useAccount:()=>A,useMint:()=>Z,usePool:()=>g,useUI:()=>u,useWallet:()=>k,withAccount:()=>I,withMint:()=>T,withPool:()=>f,withUI:()=>l,withWallet:()=>v});var n=s(92950),r=s(55754),i=s(99019),o=s(45263);const a=(0,n.createContext)({}),d=({children:e,appId:t,style:s={},antd:d=!1})=>{const c=(0,r.useSelector)((e=>e.ui)),l=(0,n.useMemo)((()=>({ui:c})),[c]),u=d?{getPopupContainer:()=>document.getElementById(t),..."object"===typeof d?d:{}}:void 0;return(0,o.jsx)(a.Provider,{value:l,children:(0,o.jsx)("section",{id:t,style:{height:"100%",backgroundColor:"transparent",...s},children:u?(0,o.jsx)(i.ConfigProvider,{...u,children:e}):e})})},c=({children:e})=>(0,o.jsx)(a.Consumer,{children:t=>n.Children.map(e,(e=>(0,n.cloneElement)(e,{...t})))}),l=e=>{class t extends n.Component{render(){const{forwardedRef:t,...s}=this.props;return(0,o.jsx)(c,{children:(0,o.jsx)(e,{ref:t,...s})})}}return(0,n.forwardRef)(((e,s)=>(0,o.jsx)(t,{...e,ref:s})))},u=()=>(0,n.useContext)(a),h=(0,n.createContext)({}),p=({children:e})=>{const t=(0,r.useSelector)((e=>e.pools)),s=(0,n.useMemo)((()=>({pools:t})),[t]);return(0,o.jsx)(h.Provider,{value:s,children:e})},m=({children:e})=>(0,o.jsx)(h.Consumer,{children:t=>n.Children.map(e,(e=>(0,n.cloneElement)(e,{...t})))}),f=e=>{class t extends n.Component{render(){const{forwardedRef:t,...s}=this.props;return(0,o.jsx)(m,{children:(0,o.jsx)(e,{ref:t,...s})})}}return(0,n.forwardRef)(((e,s)=>(0,o.jsx)(t,{...e,ref:s})))},g=()=>(0,n.useContext)(h),w=(0,n.createContext)({}),x=({children:e})=>{const t=(0,r.useSelector)((e=>e.wallet)),s=(0,n.useMemo)((()=>({wallet:t})),[t]);return(0,o.jsx)(w.Provider,{value:s,children:e})},b=({children:e})=>(0,o.jsx)(w.Consumer,{children:t=>n.Children.map(e,(e=>(0,n.cloneElement)(e,{...t})))}),v=e=>{class t extends n.Component{render(){const{forwardedRef:t,...s}=this.props;return(0,o.jsx)(b,{children:(0,o.jsx)(e,{ref:t,...s})})}}return(0,n.forwardRef)(((e,s)=>(0,o.jsx)(t,{...e,ref:s})))},k=()=>(0,n.useContext)(w),C=(0,n.createContext)({}),y=({children:e})=>{const t=(0,r.useSelector)((e=>e.accounts)),s=(0,n.useMemo)((()=>({accounts:t})),[t]);return(0,o.jsx)(C.Provider,{value:s,children:e})},j=({children:e})=>(0,o.jsx)(C.Consumer,{children:t=>n.Children.map(e,(e=>(0,n.cloneElement)(e,{...t})))}),I=e=>{class t extends n.Component{render(){const{forwardedRef:t,...s}=this.props;return(0,o.jsx)(j,{children:(0,o.jsx)(e,{ref:t,...s})})}}return(0,n.forwardRef)(((e,s)=>(0,o.jsx)(t,{...e,ref:s})))},A=()=>(0,n.useContext)(C);var M=s(19289),P=s(95418);const S="mints",E=(0,M.createAsyncThunk)("mints/getMint",(async({address:e,force:t=!1},{getState:s})=>{if(!P.account.isAddress(e))throw new Error("Invalid mint address");if(!t){const{accounts:{[e]:t}}=s();if(t)return{[e]:t}}const{splt:n}=window.sentre;return{[e]:await n.getMintData(e)}})),R=(0,M.createAsyncThunk)("mints/upsetMint",(async({address:e,data:t})=>{if(!P.account.isAddress(e))throw new Error("Invalid address");if(!t)throw new Error("Data is empty");return{[e]:t}})),L=(0,M.createAsyncThunk)("mints/deleteMint",(async({address:e})=>{if(!P.account.isAddress(e))throw new Error("Invalid address");return{address:e}}));(0,M.createSlice)({name:S,initialState:{},reducers:{},extraReducers:e=>{e.addCase(E.fulfilled,((e,{payload:t})=>{Object.assign(e,t)})).addCase(R.fulfilled,((e,{payload:t})=>{Object.assign(e,t)})).addCase(L.fulfilled,((e,{payload:t})=>{delete e[t.address]}))}}).reducer;const U=new(s(16781).Z),B=(0,n.createContext)({}),q=({children:e})=>{const t=(0,r.useDispatch)(),{mints:s,pools:i}=(0,r.useSelector)((e=>e)),a=(0,n.useCallback)((async(...e)=>await t(E(...e)).unwrap()),[t]),d=(0,n.useCallback)((async e=>{var t;if(!P.account.isAddress(e))throw new Error("Invalid mint address");const s=await U.findByAddress(e);if(null!==s&&void 0!==s&&s.decimals)return s.decimals;if(Object.values(i).findIndex((({mint_lpt:t})=>t===e))>=0)return 9;const n=await a({address:e});if(null!==(t=n[e])&&void 0!==t&&t.decimals)return n[e].decimals;throw new Error("Cannot find mint decimals")}),[a,i]),c=(0,n.useMemo)((()=>({mints:s,getMint:a,getDecimals:d,tokenProvider:U})),[s,a,d]);return(0,o.jsx)(B.Provider,{value:c,children:e})},D=({children:e})=>(0,o.jsx)(B.Consumer,{children:t=>n.Children.map(e,(e=>(0,n.cloneElement)(e,{...t})))}),T=e=>{class t extends n.Component{render(){const{forwardedRef:t,...s}=this.props;return(0,o.jsx)(D,{children:(0,o.jsx)(e,{ref:t,...s})})}}return(0,n.forwardRef)(((e,s)=>(0,o.jsx)(t,{...e,ref:s})))},Z=()=>(0,n.useContext)(B)},16781:(e,t,s)=>{"use strict";s.d(t,{Z:()=>b});var n=s(11796),r=s(67845),i=s(63805);const o={spltAddress:"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",splataAddress:"ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"},a={devnet:{...o,node:"https://api.devnet.solana.com",chainId:103,sntrAddress:"5YwUkPdXLoujGkZuo9B4LsLKj3hdkDcfP4derpspifSJ",sntrPoolAddress:"3EUPL7YQLbU6DNU5LZeQeHPXTf1MigJ2yASXA9rH5Ku4",swapAddress:"4erFSLP7oBFSVC1t35jdxmbfxEhYCKfoM6XdG2BLR3UF",taxmanAddress:"8UaZw2jDhJzv5V53569JbCd3bD4BnyCfBH3sjwgajGS9"},testnet:{...o,node:"https://api.testnet.solana.com",chainId:102,sntrAddress:"",sntrPoolAddress:"",swapAddress:"",taxmanAddress:""},mainnet:{...o,node:"https://api.mainnet-beta.solana.com",chainId:101,sntrAddress:"SENBBKVCM7homnf5RX9zqpf1GFe935hnbU4uVzY1Y6M",sntrPoolAddress:"Aa3WZX7Xunfebp2MuAcz9CNw8TYTDL7mVrmb11rjyVm6",swapAddress:"SSW7ooZ1EbEognq5GosbygA3uWW1Hq1NsFq6TsftCFV",taxmanAddress:"9doo2HZQEmh2NgfT3Yx12M89aoBheycYqH1eaR5gKb3e"}};const d="senhub",c={sen_lp:{url:"https://descartesnetwork.github.io/sen-lp/index.js",appId:"sen_lp",name:"Sen LP",author:{name:"Sentre",email:"hi@sentre.io"},supportedViews:"page,widget".split(",").map((e=>e.trim())).filter((e=>["page","widget"].includes(e))),tags:"solana,dapps,liquidity".split(",").map((e=>e.trim())),description:"Liquidity Provision to pools in the Sentre ecosystem",verified:!1}},l={development:{defaultAppId:d,extra:c,senreg:"https://descartesnetwork.github.io/senreg/register.json"},staging:{defaultAppId:d,extra:c,senreg:"https://descartesnetwork.github.io/senreg/register.json"},production:{defaultAppId:d,extra:{},senreg:"https://descartesnetwork.github.io/senreg/register.json"}},u={sol:a[i.ef],register:l[i.OB]},h=e=>({symbol:"SOL",name:"Solana",address:"11111111111111111111111111111111",decimals:9,chainId:e,extensions:{coingeckoId:"solana"},logoURI:"https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"}),p=e=>({symbol:"SNTR",name:"Sentre",address:"5YwUkPdXLoujGkZuo9B4LsLKj3hdkDcfP4derpspifSJ",decimals:9,chainId:e,extensions:{coingeckoId:"sentre"},logoURI:"https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/SENBBKVCM7homnf5RX9zqpf1GFe935hnbU4uVzY1Y6M/logo.png"}),m=[h(103),p(103),{symbol:"wBTC",name:"Wrapped Bitcoin",address:"8jk4eJymMfNZV9mkRNxJEt2VJ3pRvdJvD5FE94GXGBPM",decimals:9,chainId:103,extensions:{coingeckoId:"bitcoin"},logoURI:"https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/qfnqNqs3nCAHjnyCgLRDbBtq4p2MtHZxw8YjSyYhPoL/logo.png"},{symbol:"wETH",name:"Ethereum",address:"27hdcZv7RtuMp75vupThR3T4KLsL61t476eosMdoec4c",decimals:9,chainId:103,extensions:{coingeckoId:"ethereum"},logoURI:"https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/FeGn77dhg1KXRRFeSwwMiykZnZPw5JXW6naf2aQgZDQf/logo.png"},{symbol:"UNI",name:"Uniswap",address:"FVZFSXu3yn17YdcxLD72TFDUqkdE5xZvcW18EUpRQEbe",decimals:9,chainId:103,extensions:{coingeckoId:"uniswap"},logoURI:"https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/3MVa4e32PaKmPxYUQ6n8vFkWtCma68Ld7e7fTktWDueQ/logo.png"},{symbol:"USDC",name:"USD Coin",address:"2z6Ci38Cx6PyL3tFrT95vbEeB3izqpoLdxxBkJk2euyj",decimals:9,chainId:103,extensions:{coingeckoId:"usd-coin"},logoURI:"https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png"}],{sol:{chainId:f}}=u,g=/[\W_]+/g,w={tokenize:"full",context:!0,minlength:3},x={document:{id:"address",index:[{field:"symbol",...w},{field:"name",...w}]}};const b=class{constructor(){this.tokenMap=void 0,this.engine=void 0,this.chainId=void 0,this.cluster=void 0,this.loading=void 0,this.queue=void 0,this._init=async()=>this.tokenMap.size?[this.tokenMap,this.engine]:new Promise((async e=>{if(this.loading)return this.queue.push(e);this.loading=!0;let t=await(await(new r.DK).resolve()).filterByChainId(this.chainId).getList();for("devnet"===this.cluster&&(t=t.concat(m)),t="testnet"===this.cluster?t.concat([p(102),h(102)]):t.concat([h(101)]),t.forEach((e=>this.tokenMap.set(e.address,e))),this.engine=new n.Document(x),this.tokenMap.forEach((({address:e,...t})=>this.engine.add(e,t))),e([this.tokenMap,this.engine]);this.queue.length;)this.queue.shift()([this.tokenMap,this.engine]);this.loading=!1})),this.all=async()=>{const[e]=await this._init();return Array.from(e.values())},this.findByAddress=async e=>{const[t]=await this._init();return t.get(e)},this.find=async(e,t)=>{const[s,n]=await this._init();let r=[];return e.split(g).forEach((e=>n.search(e,t).forEach((({result:e})=>e.forEach((e=>{if(r.findIndex((({address:t})=>t===e))<0){const t=s.get(e);t&&r.push(t)}})))))),r},this.tokenMap=new Map,this.engine=void 0,this.chainId=f,this.cluster=i.ef,this.loading=!1,this.queue=[],this._init()}}},63805:(e,t,s)=>{"use strict";s.d(t,{OB:()=>r,ef:()=>i});var n=s(53933);const r="production",i=(()=>{switch(n.Z.get("network")){case"devnet":return"devnet";case"testnet":return"testnet";default:return"mainnet"}})()},53933:(e,t,s)=>{"use strict";s.d(t,{Z:()=>a});const n="sentre",r=window.localStorage,i=e=>{if(!e)return null;try{return JSON.parse(e)}catch(t){return null}},o={set:(e,t)=>{let s=i(r.getItem(n));s&&"object"===typeof s||(s={}),s[e]=t,r.setItem(n,JSON.stringify(s))},get:e=>{let t=i(r.getItem(n));return t&&"object"===typeof t?t[e]:null},clear:e=>{o.set(e,null)}},a=o},46601:()=>{},89214:()=>{},85568:()=>{},52361:()=>{},94616:()=>{},55024:()=>{}}]);
//# sourceMappingURL=204.e4b6c3ff.chunk.js.map