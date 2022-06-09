FROM node:14.0-alpine as builder

ENV NODE_ENV build

WORKDIR /home/node

COPY . /home/node

RUN npm i --legacy-per-deps \
    && npm run build \
    && npm prune --production             

# ---

FROM node:14.0-alpine

ENV NODE_ENV production

USER node
WORKDIR /home/node

COPY --from=builder /home/node/package*.json /home/node/
COPY --from=builder /home/node/node_modules/ /home/node/node_modules/
COPY --from=builder /home/node/dist/ /home/node/dist/
COPY --from=builder /home/node/client/ /home/node/client/
COPY --from=builder /home/node/uploads/ /home/node/uploads/
COPY --from=builder /home/node/tmp/ /home/node/tmp/
 
CMD ["node", "dist/main.js"]