import { Banner } from "@shopify/polaris";
import { useEffect, useState } from "react";
import useFetch from "../../customHook/useFetch";

function BannerLink() {
  const [productCount, setProductCount] = useState();
  var {getLookupSync} = useFetch()
  useEffect(() => {
    getLookupSync(
      `https://multi-account.sellernext.com/home/public/amazon/product/getMatchStatusCount`)
      .then((result) => {
        setProductCount(result.data.not_linked);
      });
  }, []);

  return (
    <div>
      <>
        <Banner
          status="warning"
          title={`${productCount ? productCount : 0} Products are yet to be linked!`}
          action={{ content: "Link Product" }}>
          <p>
            Link Amazon Listings with Shopify products to manage inventory and
            Amazon orders.
          </p>
        </Banner>
      </>
    </div>
  );
}

export default BannerLink;