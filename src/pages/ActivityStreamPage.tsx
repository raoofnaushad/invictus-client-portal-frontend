import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ActivityStreamPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activity Stream</h1>
          <p className="text-gray-600">View your activity timeline</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8 text-muted-foreground">
              Activity Stream functionality coming soon...
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ActivityStreamPage;