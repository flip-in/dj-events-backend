// Example Collection - For reference only, this must be added to payload.config.js to be used.

const isAdminOrCreatedBy = ({ req: { user } }) => {
  // Scenario #1 - Check if user has the 'admin' role
  if (user && user.role === "admin") {
    return true;
  }

  // Scenario #2 - Allow only documents with the current user set to the 'createdBy' field
  if (user) {
    // Will return access for only documents that were created by the current user
    return {
      createdBy: {
        equals: user.id,
      },
    };
  }

  // Scenario #3 - Disallow all others
  return false;
};

const Events = {
  slug: "events",
  admin: {
    useAsTitle: "name",
  },
  endpoints: [
    {
      path: "/:slug",
      method: "get",
      handler: async (req, res, next) => {
        const event = await getEventInfo(req);
        console.log("event", event);
        if (event) {
          res.status(200).send({ event });
        } else {
          res.status(400).send({ error: "not found" });
        }
      },
    },
  ],
  fields: [
    // {
    //   name: "metaData",
    //   type: "array",
    //   minRows: 1,
    //   label: "Meta Data",
    //   fields: [
    //   ],
    // },
    {
      type: "row",
      fields: [
        {
          name: "name",
          type: "text",
        },
        {
          name: "slug",
          type: "text",
        },
      ],
    },
    {
      name: "venue",
      type: "text",
    },
    {
      name: "address",
      type: "text",
    },
    {
      name: "date",
      label: "Event Date",
      type: "date",
      admin: {
        date: {
          // All config options above should be placed here
          pickerAppearance: "dayOnly",
        },
      },
    },
    {
      name: "time",
      type: "text",
    },
    {
      name: "performers",
      type: "text",
    },
    {
      name: "description",
      type: "richText",
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "createdBy",
      type: "relationship",
      relationTo: "users",
      access: {
        update: () => false,
      },
      admin: {
        readOnly: true,
        position: "sidebar",
        condition: (data) => Boolean(data?.createdBy),
      },
    },
  ],
  access: {
    read: () => true,
    update: isAdminOrCreatedBy,
    delete: isAdminOrCreatedBy,
  },
  hooks: {
    beforeChange: [
      ({ req, operation, data }) => {
        if (operation === "create") {
          if (req.user) {
            data.createdBy = req.user.id;
            return data;
          }
        }
      },
    ],
  },
};

async function getEventInfo(req) {
  const slug = req.params.slug;
  const event = await req.payload.find({
    collection: "events",
    where: {
      slug: {
        equals: slug,
      },
    },
  });
  return event;
}

export default Events;
