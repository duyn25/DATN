import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tab';
import Address from '@/components/shopping-view/address';
import ShoppingOrders from '@/components/shopping-view/order';

function ShoppingAccount() {
  return (
    <div className="flex justify-center py-10">
      <div className="w-full max-w-4xl space-y-6">
        <div className="rounded-2xl border bg-white shadow-sm">
          <Tabs defaultValue="orders" className="w-full">
            {/* Tabs header */}
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="orders"> Đơn hàng</TabsTrigger>
              <TabsTrigger value="address"> Địa chỉ</TabsTrigger>
            </TabsList>

            {/* Tabs content */}
            <TabsContent value="orders" className="p-6">
              <ShoppingOrders />
            </TabsContent>
            <TabsContent value="address" className="p-6">
              <Address />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default ShoppingAccount;
