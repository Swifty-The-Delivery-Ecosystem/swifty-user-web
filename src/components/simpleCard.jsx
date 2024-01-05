import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Chip
} from "@material-tailwind/react";
 
export function HorizontalCard({item}) {
  return (
    <Card className="my-5 w-full  flex-row">
      <CardHeader
        shadow={false}
        floated={false}
        className="m-0 w-2/5 shrink-0 rounded-r-none"
      >
        <img
          src={item.image_url}
          alt="card-image"
          className="h-full w-full object-cover"
        />
      </CardHeader>
      <CardBody>
      <Chip className="bg-white"></Chip>
        <Typography variant="h6" color="gray" className="mb-4 uppercase">
          {item.type ===0? "VEG": "NONVEG"}
        </Typography>
        <Typography variant="h4" color="blue-gray" className="mb-2">
          {item.name}
        </Typography>
        <Typography color="gray" className="mb-8 font-normal">
        ₹ {item.price}
        </Typography>
        <a href="#" className="inline-block">
          <Button variant="text" className="flex items-center gap-2">
            Add To Cart
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
              />
            </svg>
          </Button>
        </a>
      </CardBody>
    </Card>
  );
}