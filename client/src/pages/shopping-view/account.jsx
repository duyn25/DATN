import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tab';
import Address from '@/components/shopping-view/address';
function ShoppingAccount() {
    return ( <div className="flex flex-col">
        
        <div className='container mx-auto grid grid-cols-1 gap-8 py-8'>
            <div className='flex flex-col rounded-lg border bg-background p-6 shadow-sm'>
                <Tabs defaultValue='orders'>
                    <TabsList>
                        <TabsTrigger value="address">Địa chỉ</TabsTrigger>
                    </TabsList>
                    <TabsContent value="address">
                    <Address/>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    </div>);
}

export default ShoppingAccount;