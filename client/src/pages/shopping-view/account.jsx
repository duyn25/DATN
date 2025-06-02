import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tab';
import Address from '@/components/shopping-view/address';
import ShoppingOrders from '@/components/shopping-view/order';

function ShoppingAccount() {
  return (
    <div className="flex justify-center py-5">
      <div className="w-full max-w border rounded-2xl bg-white shadow-sm p-10 m-10">
        <Tabs defaultValue="orders" className="flex flex-col sm:flex-row gap-6">
          
          {/* Sidebar tabs */}
          <TabsList className="flex sm:flex-col sm:w-48 gap-1 pr-4 bg-transparent">
            <TabsTrigger
              value="orders"
              className="relative z-10 justify-start w-full text-left px-4 py-2 rounded-l-md 
                        data-[state=active]:bg-red-100 
                        data-[state=active]:text-red-600 
                        text-gray-700 hover:text-red-500 transition"
            >
              Đơn hàng
            </TabsTrigger>
            <TabsTrigger
              value="address"
              className="relative z-10 justify-start w-full text-left px-4 py-2 rounded-l-md 
                        data-[state=active]:bg-red-100 
                        data-[state=active]:text-red-600 
                        text-gray-700 hover:text-red-500 transition"
            >
              Địa chỉ
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 h-[800px] overflow-auto rounded-md border p-4 bg-gray-50">
            <TabsContent value="orders" className="min-h-[500px]">
              <ShoppingOrders />
            </TabsContent>
            <TabsContent value="address" className="min-h-[500px]">
              <Address />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

export default ShoppingAccount;
